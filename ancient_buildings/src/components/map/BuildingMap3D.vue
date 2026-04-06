<template>
  <div class="amap-fullscreen">
    <div ref="mapContainer" class="map-core-container"></div>
    <div v-if="mapLoadError" class="map-load-error">
      <div class="map-load-error__title">地图加载失败</div>
      <div class="map-load-error__desc">{{ mapLoadError }}</div>
      <div class="map-load-error__hint">
        请在 `.env` 配置 `VITE_AMAP_KEY` 和 `VITE_AMAP_SECURITY_JS_CODE` 后重启 `npm run dev`。
      </div>
      <div class="map-load-error__hint">
        同时请到高德开放平台确认：Key 类型为「Web端(JS API)」，并将 `http://localhost:*` 加入白名单。
      </div>
    </div>

    <div class="map-controls">
      <button class="control-btn" @click="resetView" title="返回全国">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
        </svg>
      </button>
      <button class="control-btn" @click="toggle3DPrism" :title="show3DPrism ? '隐藏立体柱' : '显示立体柱'">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </button>
    </div>

    <div class="map-legend" v-if="show3DPrism">
      <div class="legend-title">古建筑数量</div>
      <div class="legend-gradient"></div>
      <div class="legend-labels">
        <span>少</span>
        <span>多</span>
      </div>
    </div>

    <div class="back-btn-fixed" v-if="selectedProvince !== 'china'" @click="backToChina">
      <span>← 返回全国</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ensureAmapLoaded } from '../../utils/amapLoader.js'
import { normalizeProvinceName } from '../../utils/provinceUtils.js'

const props = defineProps({
  buildings: { type: Array, default: () => [] },
  selectedProvince: { type: String, default: 'china' },
  filters: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['building-click', 'province-click', 'update:selectedProvince'])

const mapContainer = ref(null)
const show3DPrism = ref(true)
const mapLoadError = ref('')

let map = null
let loca = null
let prismLayer = null
let mapResizeObserver = null
let provinceMarkers = []
let provincePolygons = []
let massMarks = null // 高德海量点实例
let chinaHighlightPolygon = null; // ✨ 中国高亮多边形
let activeProvincePolygon = null; // ✨ 新增：用于存放当前选中的省份高亮轮廓

const getProvinceCenter = (name) => {
  const centers = {
    '北京': [116.46, 39.92], '天津': [117.2, 39.13], '河北': [114.52, 38.05],
    '山西': [112.55, 37.87], '内蒙古': [111.73, 40.84], '辽宁': [123.43, 41.8],
    '吉林': [125.32, 43.9], '黑龙江': [126.53, 45.75], '上海': [121.47, 31.23],
    '江苏': [118.78, 32.07], '浙江': [120.15, 30.28], '安徽': [117.28, 31.86],
    '福建': [119.27, 26.08], '江西': [115.92, 28.68], '山东': [117.02, 36.65],
    '河南': [113.62, 34.75], '湖北': [114.3, 30.58], '湖南': [112.94, 28.23],
    '广东': [113.27, 23.13], '广西': [108.37, 22.82], '海南': [110.35, 20.02],
    '重庆': [106.55, 29.56], '四川': [104.07, 30.67], '贵州': [106.63, 26.65],
    '云南': [102.71, 25.04], '西藏': [91.11, 29.65], '陕西': [108.95, 34.27],
    '甘肃': [103.82, 36.07], '青海': [101.78, 36.62], '宁夏': [106.23, 38.49],
    '新疆': [87.62, 43.83], '台湾': [121.5, 25.03], '香港': [114.17, 22.28],
    '澳门': [113.55, 22.2]
  }
  return centers[name] || [105, 36]
}

const filteredBuildings = computed(() => {
  return props.buildings.filter(building => {
    if (props.filters.dynasty && !building.dynasty?.includes(props.filters.dynasty)) return false
    if (props.filters.province && normalizeProvinceName(building.province) !== props.filters.province) return false
    if (props.filters.status && building.status !== props.filters.status) return false
    return true
  })
})

const provinceData = computed(() => {
  const mapData = new Map()
  filteredBuildings.value.forEach(b => {
    const p = normalizeProvinceName(b.province)
    if (!mapData.has(p)) mapData.set(p, { province: p, count: 0, buildings: [] })
    mapData.get(p).count++
    mapData.get(p).buildings.push(b)
  })
  return Array.from(mapData.values())
})

// ✨ 生成纯净小圆点 SVG (移除所有发光/透明，干净利落)
const getDotSvg = (size) => {
  const r = size / 2;
  // 使用极其纯净的青色，移除透明度，内核改为纯白小点，视觉更清晰
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <circle cx="${r}" cy="${r}" r="${r}" fill="#36CBCB"/>
    <circle cx="${r}" cy="${r}" r="${r * 0.4}" fill="#ffffff"/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// ✨ 初始化和更新原生高德海量点 (MassMarks)
const updateMassMarks = () => {
  if (!map || !window.AMap.MassMarks) return

  try {
    const zoom = map.getZoom()
    
    // 确保zoom是有效的数字
    if (isNaN(zoom)) {
      console.warn('[BuildingMap3D] Invalid zoom value:', zoom)
      return
    }

    // 🎯 【重点 2：全局散点自适应核心】彻底不使用 6px 兜底，全部根据 zoom 进行线性计算。
    // 在全国视角 (Zoom=3.5) 下， calculatedSize = 3 + (3.5 - 3.5) * 1.5 = 3
    // 在省份视角 (Zoom=7) 下， calculatedSize = 3 + (7 - 3.5) * 1.5 = 8.25
    // 在城市视角 (Zoom=12) 下， calculatedSize = 3 + (12 - 3.5) * 1.5 = 15.75
    const calculatedSize = 3 + (zoom - 3.5) * 1.5;

    // 确保大小在 3px 到 20px 之间平滑变动
    const pointSize = Math.min(Math.max(calculatedSize, 3), 20)
    
    // 确保pointSize是有效的数字
    if (isNaN(pointSize)) {
      console.warn('[BuildingMap3D] Invalid pointSize value:', pointSize)
      return
    }

    const style = {
      url: getDotSvg(pointSize),
      anchor: new window.AMap.Pixel(pointSize / 2, pointSize / 2),
      size: new window.AMap.Size(pointSize, pointSize)
    }

    // 整理数据格式给 MassMarks
    const data = filteredBuildings.value
        .filter(b => b.coordinates && b.coordinates.length === 2)
        .map(b => ({
          lnglat: b.coordinates,
          name: b.name,
          ...b
        }))

    if (!massMarks) {
      // 首次创建
      massMarks = new window.AMap.MassMarks(data, {
        opacity: 1, // 移除透明度，让点更坚实
        zIndex: 111,
        cursor: 'pointer',
        style: style
      })

      massMarks.on('click', (e) => {
        emit('building-click', e.data)
      })

      massMarks.setMap(map)
    } else {
      // 更新数据和样式（自适应大小）
      massMarks.setStyle(style)
      massMarks.setData(data)
    }
  } catch (error) {
    console.error('[BuildingMap3D] Error in updateMassMarks:', error)
  }
}

// ✨ 【重点 1：中国部分高亮】通过遮罩多边形实现
const highlightChina = () => {
  if (!map || !window.AMap.DistrictSearch) return;

  // 如果已经存在，移除旧的（防重绘报错）
  if (chinaHighlightPolygon) map.remove(chinaHighlightPolygon);

  const district = new window.AMap.DistrictSearch({
    extensions: 'all', // 获取完整边界坐标
    subdistrict: 0,   // 不需要下级行政区
    level: 'country'  // 国级
  });

  district.search('中国', (status, result) => {
    if (status === 'complete' && result.districtList?.[0]) {
      const boundaries = result.districtList[0].boundaries;
      if (boundaries) {
        // ✨ 创建中国高亮遮罩多边形
        chinaHighlightPolygon = new window.AMap.Polygon({
          path: boundaries,
          // 极细的青色描边，增加轮廓微光
          strokeColor: '#36CBCB',
          strokeWeight: 1,
          fillOpacity: 0.1, // 极低的填充透明度
          // 填充颜色使用一种非常深、微偏青的深 navy 色，让它在 darkblue 底图上浮现出来
          fillColor: 'rgba(22, 93, 255, 0.1)',
          zIndex: 1, // 放在最底层
          bubble: true, // 允许鼠标点击穿透到底层地图
          map: map
        });
      }
    }
  });
};

const syncProvinceViewFromProps = () => {
  if (!map) return
  const val = props.selectedProvince
  if (val === 'china') {
    map.setCenter([105, 36], true, 800)
    map.setZoom(3.5, true, 800)
    updateProvinceMarkers()
    highlightProvince('china')
    if (prismLayer) prismLayer.show()
  } else {
    const center = getProvinceCenter(val)
    map.setCenter(center, true, 600)
    map.setZoom(7, true, 600)
    highlightProvince(val)
    if (prismLayer) prismLayer.hide()
  }
  nextTick(() => updateMassMarks())
}

const resizeMapIfReady = () => {
  if (!map) return
  try {
    map.resize()
  } catch (e) {
    console.warn('[BuildingMap3D] map.resize failed', e)
  }
}

// 初始化基础地图
const initNativeMap = () => {
  if (!mapContainer.value || !window.AMap) return
  
  // 确保地图容器有有效的尺寸
  const containerRect = mapContainer.value.getBoundingClientRect()
  if (containerRect.width === 0 || containerRect.height === 0) {
    console.warn('[BuildingMap3D] Map container has no size, waiting for resize...')
    // 等待容器尺寸生效后再初始化
    setTimeout(initNativeMap, 100)
    return
  }

  map = new window.AMap.Map(mapContainer.value, {
    viewMode: '3D',
    pitch: 45,
    rotation: -10,
    zoom: props.selectedProvince === 'china' ? 3.5 : 7,
    center: getProvinceCenter(props.selectedProvince),
    mapStyle: 'amap://styles/darkblue', // 使用官方 Darkblue 样式
    skyColor: '#0a0a1a',
    defaultCursor: 'pointer',
    canvasOptions: {
      willReadFrequently: true
    }
  })

  // 初始化 Loca 3D 柱子
  if (window.Loca) {
    loca = new window.Loca.Container({ map })
    if (show3DPrism.value) initPrismLayer()
  }

  map.on('complete', () => {
    highlightChina()
    updateMassMarks()
    updateProvinceMarkers()
    initProvincePolygons()
    syncProvinceViewFromProps()
  })

  // 监听缩放，实时调整点的大小
  map.on('zoomend', () => {
    updateMassMarks()
  })

  window.addEventListener('resize', resizeMapIfReady)
  if (typeof ResizeObserver !== 'undefined') {
    mapResizeObserver = new ResizeObserver(() => resizeMapIfReady())
    mapResizeObserver.observe(mapContainer.value)
  }
  nextTick(() => resizeMapIfReady())
}

// --- 旗帜与3D柱子渲染逻辑 (保持原样) ---

const createFlagSVG = (count) => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="1" fill="#b91c1c"/>
      <circle cx="5" cy="7" r="2" fill="#ffd700"/>
      <text x="10" y="10" font-size="7" fill="#fff" font-weight="bold" text-anchor="middle">${count}</text>
    </svg>
  `)}`
}

const updateProvinceMarkers = () => {
  try {
    if (!map) return
    provinceMarkers.forEach(m => m.setMap(null))
    provinceMarkers = []

    if (props.selectedProvince !== 'china') return

    provinceData.value.forEach(p => {
      const [lng, lat] = getProvinceCenter(p.province)
      const flagContent = document.createElement('div')
      flagContent.className = 'province-flag'
      flagContent.innerHTML = `
        <div class="flag-icon"><img src="${createFlagSVG(p.count)}" alt="${p.province}" /></div>
        <div class="flag-label">${p.province} · ${p.count}处</div>
      `
      const marker = new window.AMap.Marker({
        position: [lng, lat],
        content: flagContent,
        offset: new window.AMap.Pixel(-10, -15),
        zIndex: 100
      })
      marker.on('click', () => {
        emit('update:selectedProvince', p.province)
        emit('province-click', p.province)
      })
      marker.setMap(map)
      provinceMarkers.push(marker)
    })
  } catch (error) {
    console.error('[BuildingMap3D] Error in updateProvinceMarkers:', error)
  }
}

const initProvincePolygons = () => {
  if (!window.AMap?.DistrictSearch || !map) return
  provincePolygons.forEach(p => p.setMap(null))
  provincePolygons = []

  // 不需要绘制省级多边形了，我们用 Loca 柱子和 MassMarks 表示
}

const initPrismLayer = () => {
  if (!loca) return
  prismLayer = new window.Loca.PrismLayer({ zIndex: 10, opacity: 0.85, visible: show3DPrism.value })

  const maxCount = Math.max(...provinceData.value.map(p => p.count), 1)
  const sourceData = {
    type: 'FeatureCollection',
    features: provinceData.value.map(p => ({
      type: 'Feature',
      properties: { name: p.province, count: p.count },
      geometry: { type: 'Point', coordinates: getProvinceCenter(p.province) }
    }))
  }

  prismLayer.setSource(new window.Loca.GeoJSONSource({ data: sourceData }))
  prismLayer.setStyle({
    radius: 30000,
    color: (i, f) => {
      const r = f.properties.count / maxCount
      if (r > 0.7) return '#FFD700'
      if (r > 0.4) return '#36CBCB'
      return '#165DFF'
    },
    height: (i, f) => Math.max(f.properties.count * 4000, 6000),
    topColor: '#00f2fe',
    sideColor: (i, f) => f.properties.count / maxCount > 0.5 ? 'rgba(54,203,203,0.8)' : 'rgba(22,93,255,0.8)',
    lighting: true
  })

  prismLayer.on('click', (e) => {
    const name = e.feature?.properties?.name
    if (name) {
      emit('update:selectedProvince', name)
      emit('province-click', name)
    }
  })
  loca.add(prismLayer)
}

const toggle3DPrism = () => {
  show3DPrism.value = !show3DPrism.value
  if (prismLayer) {
    show3DPrism.value ? prismLayer.show() : prismLayer.hide()
  }
}

const resetView = () => {
  emit('update:selectedProvince', 'china')
  map?.setCenter([105, 36], true, 800)
  map?.setZoom(3.5, true, 800)
}

const backToChina = () => emit('update:selectedProvince', 'china')

// ✨ 新增函数：精准高亮特定省份
const highlightProvince = (provinceName) => {
  if (!map || !window.AMap.DistrictSearch) return;

  // 1. 每次调用时，先清除上一次高亮的省份
  if (activeProvincePolygon) {
    map.remove(activeProvincePolygon);
    activeProvincePolygon = null;
  }

  // 2. 如果是返回全国，直接结束（不需要高亮某个省）
  if (!provinceName || provinceName === 'china') return;

  // 3. 搜索并绘制目标省份
  const district = new window.AMap.DistrictSearch({
    extensions: 'all',
    subdistrict: 0,
    level: 'province'
  });

  district.search(provinceName, (status, result) => {
    if (status === 'complete' && result.districtList?.[0]) {
      const boundaries = result.districtList[0].boundaries;
      if (boundaries) {
        activeProvincePolygon = new window.AMap.Polygon({
          path: boundaries,
          strokeColor: '#00ffff', // 高亮赛博朋克青色描边
          strokeWeight: 3,        // 边界加粗
          fillColor: '#00ffff',   // 内部填充也是青色
          fillOpacity: 0.15,      // 微微的半透明发光感
          zIndex: 10,
          bubble: true, // 允许点击穿透到底层散点
          map: map
        });
      }
    }
  });
}

// --- 监听与生命周期 ---

watch(() => props.selectedProvince, () => {
  if (!map) return
  syncProvinceViewFromProps()
})

watch([() => props.buildings, () => props.filters], () => {
  if (prismLayer) initPrismLayer()
  updateProvinceMarkers()
  nextTick(() => updateMassMarks())
}, { deep: true })

onMounted(() => {
  ensureAmapLoaded('BuildingMap3D')
    .then((loaded) => {
      if (!loaded || !window.AMap) {
        mapLoadError.value = '未检测到高德 JSAPI（通常是 Key 未配置或无效）'
        return
      }
      initNativeMap()
    })
    .catch((e) => {
      console.error('[BuildingMap3D]', e)
      mapLoadError.value = `地图脚本加载异常：${e?.message || '未知错误'}`
    })
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeMapIfReady)
  mapResizeObserver?.disconnect()
  mapResizeObserver = null
  provinceMarkers.forEach(m => m.setMap(null))
  if (massMarks) massMarks.clear()
  if (chinaHighlightPolygon) chinaHighlightPolygon.setMap(null);
  if (activeProvincePolygon) activeProvincePolygon.setMap(null); // ✨ 清理高亮
  map?.destroy()
})
</script>

<style scoped>
.amap-fullscreen {
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.map-load-error {
  position: absolute;
  inset: 0;
  z-index: 250;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  padding: 24px;
  background: rgba(8, 12, 24, 0.88);
  color: #e5e7eb;
}

.map-load-error__title {
  font-size: 20px;
  font-weight: 700;
  color: #36CBCB;
}

.map-load-error__desc {
  font-size: 14px;
  color: #fca5a5;
}

.map-load-error__hint {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  max-width: 560px;
  line-height: 1.7;
}

.map-core-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(10, 10, 30, 0.8);
  border: 1px solid rgba(54, 203, 203, 0.3);
  color: #36CBCB;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.control-btn:hover {
  background: rgba(54, 203, 203, 0.2);
  border-color: #36CBCB;
}

.map-legend {
  position: absolute;
  bottom: 30px;
  left: 20px;
  background: rgba(10, 10, 30, 0.9);
  padding: 15px 20px;
  border-radius: 10px;
  border: 1px solid rgba(54, 203, 203, 0.3);
  z-index: 100;
}

.legend-title {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;
}

.legend-gradient {
  width: 150px;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #165DFF, #36CBCB, #FFD700);
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.back-btn-fixed {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  background: rgba(10, 10, 30, 0.9);
  border: 1px solid rgba(54, 203, 203, 0.3);
  border-radius: 8px;
  color: #36CBCB;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s;
}

:deep(.province-flag) {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

:deep(.flag-icon) {
  animation: flagWave 2s ease-in-out infinite;
}

:deep(.flag-label) {
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 8px;
  border-radius: 4px;
  margin-top: 4px;
}

@keyframes flagWave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
</style>