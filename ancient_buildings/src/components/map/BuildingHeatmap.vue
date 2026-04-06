<template>
  <div ref="mapContainer" class="amap-fullscreen">
    <div ref="amapContainer" class="map-wrapper"></div>

    <div class="dashboard-hud dashboard-hud-top">
      <div class="hud-title">当前点击点经纬度 (Clicked Location)</div>
      <div class="hud-value" v-if="clickedLatLng">
        经度 (Lng): <span>{{ clickedLatLng.lng }}</span> |
        纬度 (Lat): <span>{{ clickedLatLng.lat }}</span>
      </div>
      <div class="hud-value text-muted" v-else>
        请在地图上点击...
      </div>
    </div>

    <div class="dashboard-sidebar slanted-panel">
      <div class="panel-inner">
        <div class="hud-section">
          <div class="section-header">省份筛选 (Province)</div>
          <div class="section-content scrollable">
            <div
                class="list-item province-item"
                v-for="p in allProvinces"
                :key="p.province"
                :class="{ active: selectedProvince === p.province }"
                @click="onProvinceItemClick(p.province)"
            >
              <div class="p-name">{{ p.province }}</div>
              <div class="p-count">{{ p.count }}处</div>
            </div>
          </div>
        </div>

        <div class="hud-section">
          <div class="section-header">朝代筛选 (Dynasty)</div>
          <div class="section-content filters-row">
            <button
                class="filter-pill"
                v-for="d in majorDynasties"
                :key="d"
                :class="{ active: filters.dynasty === d }"
                @click="onDynastyFilterClick(d)"
            >
              {{ d }}
            </button>
            <button class="filter-pill reset-btn" @click="onDynastyFilterClick('')">重置</button>
          </div>
        </div>

        <div class="hud-section">
          <div class="section-header">已筛选古建筑 (Building List)</div>
          <div class="section-content scrollable">
            <div
                class="list-item building-item"
                v-for="b in filteredBuildingsList"
                :key="b.id"
                @click="onBuildingListItemClick(b)"
            >
              <div class="b-name">{{ b.name }}</div>
              <div class="b-city text-muted">{{ b.city }} · {{ b.dynasty }}代</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="map-controls-group">
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

    <div class="slanted-panel slanted-panel-bottom slanted-legend" v-if="show3DPrism">
      <div class="panel-inner">
        <div class="legend-title">古建筑数量</div>
        <div class="legend-gradient"></div>
        <div class="legend-labels">
          <span>少</span>
          <span>多</span>
        </div>
      </div>
    </div>

    <div class="building-popup slanted-panel glass-popup" v-if="selectedBuilding" :style="popupStyle">
      <div class="panel-inner">
        <div class="popup-header">
          <h3>{{ selectedBuilding.name }}</h3>
          <button class="close-popup" @click="selectedBuilding = null">×</button>
        </div>
        <div class="popup-image" v-if="getBuildingImage(selectedBuilding)">
          <img :src="getBuildingImage(selectedBuilding)" :alt="selectedBuilding.name" />
        </div>
        <div class="popup-info">
          <div class="info-item">
            <span class="label">城市：</span>
            <span class="value">{{ selectedBuilding.location || selectedBuilding.city }}</span>
          </div>
          <div class="info-item">
            <span class="label">朝代：</span>
            <span class="value">{{ selectedBuilding.dynasty }}</span>
          </div>
          <div class="info-item">
            <span class="label">类型：</span>
            <span class="value">{{ getBuildingType(selectedBuilding) }}</span>
          </div>
        </div>
        <div class="popup-desc" v-if="getBuildingDescription(selectedBuilding)">
          {{ getBuildingDescription(selectedBuilding) }}
        </div>
      </div>
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

const emit = defineEmits(['building-click', 'province-click', 'update:selectedProvince', 'update:filters'])

const mapContainer = ref(null)
const amapContainer = ref(null)
const selectedBuilding = ref(null)
const show3DPrism = ref(true)
const popupStyle = ref({})

// ✨ 顶部 HUD 显示所需的经纬度变量
const clickedLatLng = ref(null);

let map = null
let loca = null
let prismLayer = null
let provinceMarkers = []
let provincePolygons = []
let buildingMarkers = []

// ✨ 朝代筛选预设 (只列出主要朝代)
const majorDynasties = ['唐', '宋', '元', '明', '清', '民国'];

// 辅助图片函数
const getBuildingImage = (building) => building.images?.[0] || building.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400'
const getBuildingType = (building) => building.category || building.type || '古建筑'
const getBuildingDescription = (building) => building.details?.overview || building.description || '暂无描述'

// ✨ 【重点】：获取所有省份数据以供筛选列表使用
const allProvinces = computed(() => {
  const mapData = new Map()
  props.buildings.forEach(b => {
    const p = normalizeProvinceName(b.province)
    if (!mapData.has(p)) mapData.set(p, { province: p, count: 0 })
    mapData.get(p).count++
  })
  // 按照数量排序
  return Array.from(mapData.values()).sort((a, b) => b.count - a.count)
})

// 根据筛选器过滤建筑
const filteredBuildings = computed(() => {
  return props.buildings.filter(building => {
    if (props.filters.dynasty && !building.dynasty?.includes(props.filters.dynasty)) return false
    if (props.filters.province && normalizeProvinceName(building.province) !== props.filters.province) return false
    return true
  })
})

// 获取当前省份的数据 (用于旗帜渲染)
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

// ✨ 获取筛选后的列表展示数据 (限制数量以提高性能)
const filteredBuildingsList = computed(() => {
  return filteredBuildings.value.slice(0, 100);
})

// 初始化地图
const initMap = () => {
  if (!amapContainer.value || !window.AMap) return
  
  // 确保地图容器有有效的尺寸
  const containerRect = amapContainer.value.getBoundingClientRect()
  if (containerRect.width === 0 || containerRect.height === 0) {
    console.warn('[BuildingHeatmap] Map container has no size, waiting for resize...')
    // 等待容器尺寸生效后再初始化
    setTimeout(initMap, 100)
    return
  }

  try {
    map = new window.AMap.Map(amapContainer.value, {
      viewMode: '3D',
      pitch: 45,
      rotation: -10,
      zoom: props.selectedProvince === 'china' ? 3.5 : 7,
      center: getProvinceCenter(props.selectedProvince),
      mapStyle: 'amap://styles/darkblue',
      skyColor: '#0a0a1a',
      buildingAnimation: true,
      defaultCursor: 'pointer',
      showIndoorMap: false,
      canvasOptions: {
        willReadFrequently: true
      }
    })

    if (window.Loca) {
      loca = new window.Loca.Container({ map })
      if (show3DPrism.value) initPrismLayer()
    }

    nextTick(() => {
      updateProvinceMarkers()
      // initProvincePolygons() // 暂时移除多边形边界，用旗帜和MassMarks表示
    })

    // ✨ 监听点击事件，更新顶部 HUD 的经纬度
    map.on('click', (e) => {
      clickedLatLng.value = {
        lng: e.lnglat.getLng().toFixed(4),
        lat: e.lnglat.getLat().toFixed(4)
      }
    })
  } catch (error) {
    console.error('[BuildingHeatmap] Error in initMap:', error)
  }
}

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
        onProvinceItemClick(p.province)
      })
      marker.setMap(map)
      provinceMarkers.push(marker)
    })
  } catch (error) {
    console.error('[BuildingHeatmap] Error in updateProvinceMarkers:', error)
  }
}

// 初始化 3D 柱子层 (保持不变)
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
    if (name) onProvinceItemClick(name)
  })
  loca.add(prismLayer)
}

// ✨ 【交互】：点击省份列表项目
const onProvinceItemClick = (pName) => {
  emit('update:selectedProvince', pName)
  emit('province-click', pName)
}

// ✨ 【交互】：点击朝代筛选标签
const onDynastyFilterClick = (dynasty) => {
  // 深度复制并更新过滤器
  const newFilters = { ...props.filters, dynasty: dynasty };
  emit('update:filters', newFilters);
}

// ✨ 【交互】：点击建筑列表项目进行定位
const onBuildingListItemClick = (building) => {
  emit('building-click', building);
  if (building.coordinates) {
    map.setCenter(building.coordinates);
    map.setZoom(16);
  }
}

const toggle3DPrism = () => {
  show3DPrism.value = !show3DPrism.value
  if (prismLayer) prismLayer.setVisible(show3DPrism.value)
}

const resetView = () => {
  emit('update:selectedProvince', 'china')
  map?.setCenter([105, 36], true, 800)
  map?.setZoom(3.5, true, 800)
}

const backToChina = () => emit('update:selectedProvince', 'china')

// 监听视图层级变化（china 分支勿调用 resetView，避免重复 emit）
watch(() => props.selectedProvince, (val) => {
  if (!map) return
  if (val === 'china') {
    map.setCenter([105, 36], true, 800)
    map.setZoom(3.5, true, 800)
    updateProvinceMarkers()
    if (prismLayer) prismLayer.setVisible(true)
  } else {
    const center = getProvinceCenter(val)
    map.setCenter(center, true, 600)
    map.setZoom(7, true, 600)
    if (prismLayer) prismLayer.setVisible(false)
  }
})

watch([() => props.buildings, () => props.filters], () => {
  if (prismLayer) initPrismLayer()
  updateProvinceMarkers()
}, { deep: true })

onMounted(() => {
  ensureAmapLoaded('BuildingHeatmap')
    .then((loaded) => {
      if (!loaded || !window.AMap) return
      initMap()
      nextTick(() => {
        const val = props.selectedProvince
        if (val === 'china') {
          updateProvinceMarkers()
          if (prismLayer) prismLayer.setVisible(true)
        } else if (map) {
          map.setCenter(getProvinceCenter(val), true, 0)
          map.setZoom(7, true, 0)
          if (prismLayer) prismLayer.setVisible(false)
        }
      })
    })
    .catch((e) => console.error('[BuildingHeatmap]', e))
})

onUnmounted(() => {
  provinceMarkers.forEach(m => m.setMap(null))
  map?.destroy()
})
</script>

<style scoped>
/* 核心 full-screen 容器 */
.amap-fullscreen {
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
  overflow: hidden;
  font-family: 'Museo', 'SF Pro SC', system-by-system, sans-serif; /* 使用现代感serif字体 */
  background-color: #0a0a1a;
  color: #fff;
}

.map-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* -----------------
 ✨ 面板设计风格 (Glassmorphism + Slanted)
----------------- */

.slanted-panel {
  position: absolute;
  background: rgba(10, 10, 30, 0.7); /* 半透明navy色 */
  backdrop-filter: blur(10px); /* 模糊背景 */
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(54, 203, 203, 0.3); /* 极细青色描边 */
  box-shadow: 0 0 25px rgba(54, 203, 203, 0.2);
  transform: skewX(-5deg); /* 创建斜切面核心效果 */
  overflow: hidden;
  z-index: 10;
  border-radius: 4px; /* 轻微圆角 */
}

/* 为了让内容保持平直，需要反向skewX */
.panel-inner {
  transform: skewX(5deg);
  width: 100%;
  height: 100%;
  position: relative;
}

/* -----------------
 ✨ 顶部 HUD: 经纬度显示
----------------- */

.dashboard-hud {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 10, 30, 0.85);
  backdrop-filter: blur(8px);
  padding: 8px 30px;
  border: 1px solid rgba(54, 203, 203, 0.4);
  border-radius: 20px;
  text-align: center;
  z-index: 100;
  color: rgba(255, 255, 255, 0.8);
}

.hud-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 3px;
}

.hud-value span {
  color: #36CBCB;
  font-weight: bold;
}

/* -----------------
 ✨ 左侧仪表盘控制面板 (Slanted Sidebar)
----------------- */

.dashboard-sidebar {
  top: 80px;
  left: -20px; /* 轻微移出屏幕，增加斜面动感 */
  width: 320px;
  height: calc(100vh - 120px);
  padding: 40px 20px;
  padding-left: 40px; /* 内容离屏幕边缘有间距 */
}

.hud-section {
  margin-bottom: 30px;
}

.section-header {
  font-size: 16px;
  color: #36CBCB;
  border-left: 3px solid #36CBCB;
  padding-left: 10px;
  margin-bottom: 15px;
  text-shadow: 0 0 8px #36CBCB;
}

.section-content {
  color: rgba(255, 255, 255, 0.8);
}

.scrollable {
  max-height: 25vh;
  overflow-y: auto;
}

/* 列表项目设计 */
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 6px;
  background: rgba(54, 203, 203, 0.05);
  border-bottom: 1px solid rgba(54, 203, 203, 0.1);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.list-item:hover {
  background: rgba(54, 203, 203, 0.15);
  transform: translateX(3px);
}

.list-item.active {
  background: rgba(54, 203, 203, 0.3);
  border-bottom-color: #36CBCB;
  color: #fff;
}

.p-name {
  font-size: 14px;
}

.p-count {
  font-size: 12px;
  color: #36CBCB;
}

/* 朝代筛选器样式 */
.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-pill {
  background: none;
  border: 1px solid rgba(54, 203, 203, 0.4);
  color: rgba(255, 255, 255, 0.8);
  padding: 6px 15px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill:hover, .filter-pill.active {
  background-color: #36CBCB;
  border-color: #36CBCB;
  color: #0a0a1a;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(54, 203, 203, 0.4);
}

.filter-pill.reset-btn {
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.4);
}

.b-name {
  font-size: 14px;
  font-weight: bold;
}

.b-city {
  font-size: 12px;
  text-align: right;
}

/* -----------------
 ✨ 底部 Slanted Panel: 图例 (integrated)
----------------- */

.slanted-legend {
  bottom: 20px;
  left: 310px; /* 放在 sidebar 旁边 */
  padding: 15px 20px;
  transform: skewX(-5deg); /* 创建斜切面核心效果 */
}

.legend-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
}

.legend-gradient {
  width: 150px;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #165DFF, #36CBCB, #FFD700);
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

/* -----------------
 ✨ 整合其他控件和弹窗
----------------- */

.back-btn-fixed {
  position: absolute;
  top: 80px;
  left: 320px; /* 在 sidebar 旁边 */
  padding: 10px 20px;
  background: rgba(10, 10, 30, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(54, 203, 203, 0.4);
  border-radius: 8px;
  color: #36CBCB;
  cursor: pointer;
  z-index: 100;
  font-size: 14px;
}

.map-controls-group {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
}

.control-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: rgba(10, 10, 30, 0.85);
  border: 1px solid rgba(54, 203, 203, 0.3);
  color: #36CBCB;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(54, 203, 203, 0.2);
  border-color: #36CBCB;
}

/* 弹窗设计 (slanted & glassmorphic) */
.glass-popup {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) skewX(-5deg);
  width: 420px;
  max-height: 80vh;
  z-index: 200;
  box-shadow: 0 0 50px rgba(54, 203, 203, 0.4);
  border-color: rgba(54, 203, 203, 0.6);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background: rgba(54, 203, 203, 0.15);
  border-bottom: 1px solid rgba(54, 203, 203, 0.3);
}

.popup-header h3 {
  margin: 0;
  color: #36CBCB;
  font-size: 20px;
  font-weight: bold;
}

.close-popup {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
  cursor: pointer;
}

.close-popup:hover { color: #fff; }

.popup-image {
  width: 100%;
  height: 220px;
}

.popup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup-info {
  padding: 20px 25px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
  font-size: 14px;
}

.info-item .label {
  color: rgba(255, 255, 255, 0.5);
  min-width: 60px;
}

.info-item .value { color: #fff; }

.popup-desc {
  padding: 0 25px 25px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  max-height: 180px;
  overflow-y: auto;
}

/* 适配原生高德旗帜与涟漪散点 (保持不变) */
:deep(.province-flag) { display: flex; flex-direction: column; align-items: center; cursor: pointer; }
:deep(.flag-icon) { animation: flagWave 2s ease-in-out infinite; }
:deep(.flag-label) { font-size: 11px; color: #fff; background: rgba(0, 0, 0, 0.6); padding: 2px 7px; border-radius: 4px; margin-top: 4px; white-space: nowrap; }

@keyframes flagWave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

/* 涟漪标记样式 (保持不变) */
:deep(.ripple-marker) { position: relative; width: 16px; height: 16px; }
:deep(.ripple-dot) { position: absolute; width: 8px; height: 8px; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; }
:deep(.ripple-ring) { position: absolute; width: 16px; height: 16px; border-radius: 50%; border: 2px solid; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: ripple 2s linear infinite; opacity: 0; }
:deep(.ripple-ring:nth-child(2)) { animation-delay: 0.5s; }

@keyframes ripple { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } }
</style>