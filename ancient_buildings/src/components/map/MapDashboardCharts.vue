<template>
  <div class="map-dash-charts">
    <div
      class="stat-card stat-card--total glass-effect"
      role="button"
      tabindex="0"
      aria-label="放大查看总体统计"
      @click="openZoom('total')"
      @keydown.enter.prevent="openZoom('total')"
      @keydown.space.prevent="openZoom('total')"
    >
      <div class="stat-header">总体统计</div>
      <div ref="totalEl" class="stat-chart stat-chart--gauge" />
      <div class="stat-number">
        <span class="number-value">{{ countFormatted }}</span>
        <span class="number-unit">座（当前筛选）</span>
      </div>
    </div>

    <div
      class="stat-card stat-card--dynasty glass-effect"
      role="button"
      tabindex="0"
      aria-label="放大查看朝代分布"
      @click="openZoom('dynasty')"
      @keydown.enter.prevent="openZoom('dynasty')"
      @keydown.space.prevent="openZoom('dynasty')"
    >
      <div class="stat-header">朝代分布</div>
      <div ref="dynastyEl" class="stat-chart stat-chart--pie" />
    </div>

    <div
      class="stat-card stat-card--province glass-effect"
      role="button"
      tabindex="0"
      aria-label="放大查看省份排行"
      @click="openZoom('province')"
      @keydown.enter.prevent="openZoom('province')"
      @keydown.space.prevent="openZoom('province')"
    >
      <div class="stat-header">省份排行 TOP5</div>
      <div ref="provinceEl" class="stat-chart stat-chart--bar" />
    </div>
  </div>

  <div v-if="zoomOpen" class="chart-zoom-mask" @click.self="closeZoom">
    <div
      class="chart-zoom-panel glass-effect"
      :class="`chart-zoom-panel--${zoomType}`"
      role="dialog"
      aria-modal="true"
      :aria-label="`放大图表：${zoomTitle}`"
    >
      <div class="chart-zoom-head" :class="`chart-zoom-head--${zoomType}`">
        <h3>{{ zoomTitle }}</h3>
        <button type="button" class="chart-zoom-close" @click="closeZoom">关闭</button>
      </div>
      <div ref="zoomEl" class="chart-zoom-canvas" :class="`chart-zoom-canvas--${zoomType}`" />
      <p v-if="zoomType === 'province'" class="chart-zoom-tip">提示：点击柱子可跳转地图到对应省份。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { normalizeProvinceName } from '../../utils/provinceUtils.js'

const props = defineProps({
  buildings: { type: Array, default: () => [] },
  totalBuildings: { type: Number, default: 1 }
})
const emit = defineEmits(['province-select'])

const totalEl = ref(null)
const dynastyEl = ref(null)
const provinceEl = ref(null)
const zoomEl = ref(null)
const zoomOpen = ref(false)
const zoomType = ref('total')

let chartTotal = null
let chartDynasty = null
let chartProvince = null
let chartZoom = null

const countFormatted = computed(() =>
  props.buildings.length.toLocaleString('zh-CN')
)
const zoomTitle = computed(() => {
  if (zoomType.value === 'dynasty') return '朝代分布（放大）'
  if (zoomType.value === 'province') return '省份排行 TOP5（放大）'
  return '总体统计（放大）'
})

function aggDynasty(list) {
  const m = {}
  for (const b of list) {
    const d = (b.dynasty && String(b.dynasty)) || '未知'
    m[d] = (m[d] || 0) + 1
  }
  return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 12)
}

function aggProvinceTop5(list) {
  const m = {}
  for (const b of list) {
    const p = normalizeProvinceName(b.province)
    if (!p) continue
    m[p] = (m[p] || 0) + 1
  }
  return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5)
}

const GUOFENG_COLORS = {
  low: '#3A7CA5', // 天青釉
  mid: '#58A993', // 松烟青
  high: '#C44536', // 朱砂红
  pointer: '#D4AF37', // 赤金
  border: '#B8860B', // 鎏金
  panelBg: '#2D2327', // 檀木棕
  text: '#F5F5DC', // 牙白
}
const textMuted = 'rgba(245,245,220,0.76)'
const accent = GUOFENG_COLORS.pointer
const KAITI_FONT = `"STKaiti","KaiTi","楷体",serif`

function buildTotalOption(n, max, enlarged = false) {
  const lowStop = 0.25
  const midStop = 0.625
  const labelFont = `"STKaiti","KaiTi","楷体",serif`
  return {
    animationDuration: enlarged ? 1500 : 600,
    series: [
      {
        type: 'gauge',
        min: 0,
        max,
        splitNumber: Math.min(8, max),
        center: ['50%', enlarged ? '57%' : '54%'],
        radius: enlarged ? '88%' : '82%',
        axisLine: {
          lineStyle: {
            width: enlarged ? 14 : 10,
            color: [
              [lowStop, GUOFENG_COLORS.low],
              [midStop, GUOFENG_COLORS.mid],
              [1, GUOFENG_COLORS.high]
            ]
          }
        },
        axisTick: { show: false },
        splitLine: {
          length: enlarged ? 9 : 7,
          lineStyle: { color: 'rgba(245,245,220,0.6)', width: enlarged ? 1.3 : 1 }
        },
        axisLabel: {
          color: textMuted,
          fontSize: enlarged ? 15 : 10,
          fontFamily: labelFont,
          distance: enlarged ? 18 : 12
        },
        pointer: {
          icon: 'path://M-3 34 L0 -86 L3 34 L0 24 Z',
          width: enlarged ? 14 : 10,
          length: enlarged ? '62%' : '58%',
          itemStyle: {
            color: accent,
            borderColor: '#B8860B',
            borderWidth: enlarged ? 1.8 : 1.2,
            shadowBlur: enlarged ? 10 : 6,
            shadowColor: 'rgba(212,175,55,0.38)'
          }
        },
        anchor: {
          show: true,
          showAbove: true,
          size: enlarged ? 16 : 11,
          itemStyle: {
            color: '#8B4513',
            borderColor: '#D4AF37',
            borderWidth: enlarged ? 2 : 1.2
          }
        },
        title: {
          show: enlarged,
          offsetCenter: [0, '42%'],
          fontSize: 19,
          color: GUOFENG_COLORS.text,
          fontFamily: labelFont
        },
        detail: {
          valueAnimation: true,
          fontSize: enlarged ? 36 : 16,
          fontFamily: labelFont,
          fontWeight: 700,
          color: GUOFENG_COLORS.text,
          formatter: '{value}',
          offsetCenter: [0, enlarged ? '68%' : '70%'],
          textShadowBlur: enlarged ? 3 : 0,
          textShadowColor: enlarged ? '#F5F5DC' : 'transparent'
        },
        data: [{ value: n, name: '总体统计' }]
      }
    ]
  }
}

function buildDynastyOption(dyn, enlarged = false) {
  if (!dyn.length) {
    return {
      animationDuration: 300,
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: { color: textMuted, fontSize: enlarged ? 20 : 13 }
      },
      series: [
        {
          type: 'pie',
          radius: ['52%', '72%'],
          silent: true,
          label: { show: false },
          data: [{ value: 1, itemStyle: { color: 'rgba(255,255,255,0.12)' } }]
        }
      ]
    }
  }

  const totalDynasty = dyn.reduce((sum, [, v]) => sum + v, 0)
  const [topDynasty, topValue] = dyn[0]
  const topRatio = totalDynasty ? Math.round((topValue / totalDynasty) * 100) : 0

  return {
    animationDuration: 400,
    title: {
      text: `${topDynasty}\n${topRatio}%`,
      left: 'center',
      top: '42%',
      textStyle: {
        color: '#fff',
        fontSize: enlarged ? 18 : 12,
        fontWeight: 600,
        lineHeight: enlarged ? 25 : 18
      }
    },
    color: ['#667eea', '#36CBCB', '#FFD700', '#764ba2', '#ff6b6b', '#4ecdc4', '#95e1d3', '#f38181'],
    tooltip: { trigger: 'item', textStyle: { fontSize: enlarged ? 14 : 12 } },
    series: [
      {
        type: 'pie',
        radius: ['46%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 4, borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1 },
        label: { color: 'rgba(255,255,255,0.85)', fontSize: enlarged ? 13 : 10 },
        data: dyn.map(([name, value]) => ({ name, value })),
        emphasis: { disabled: true }
      },
      {
        type: 'pie',
        radius: ['72%', '74%'],
        silent: true,
        z: 0,
        label: { show: false },
        data: [{ value: 1, itemStyle: { color: 'rgba(255,255,255,0.2)' } }]
      }
    ]
  }
}

function buildProvinceOption(prov, enlarged = false) {
  const rankPalette = [
    '#D4AF37', // 第1名 金色
    '#C44536', // 第2名 朱砂红
    '#3A7CA5', // 第3名 天青
    '#5C8D4D', // 第4名 竹绿
    '#8A5A3B', // 第5名 赭石
  ]
  const ranked = prov.map(([name, value], i) => ({ name, value, rank: i + 1 }))
  const display = ranked.slice().reverse()
  const names = display.map((p) => p.name)
  const values = display.map((p) => p.value)
  const dataItems = display.map((item) => {
    const color = rankPalette[Math.max(0, Math.min(rankPalette.length - 1, item.rank - 1))]
    const glow = item.rank === 1 ? 20 : item.rank === 2 ? 16 : item.rank === 3 ? 13 : item.rank === 4 ? 10 : 6
    return {
      value: item.value,
      name: item.name,
      itemStyle: {
        borderRadius: [0, 9, 9, 0],
        borderColor: 'rgba(245,245,220,0.78)',
        borderWidth: enlarged ? 1.1 : 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: 'rgba(45,35,39,0.92)' },
          { offset: 0.35, color },
          { offset: 1, color },
        ]),
        shadowBlur: glow,
        shadowColor: `${color}88`,
      },
      emphasis: {
        scale: true,
        itemStyle: {
          shadowBlur: glow + 7,
          shadowColor: `${color}cc`,
          borderColor: '#F5F5DC',
          borderWidth: enlarged ? 1.5 : 1.1,
        },
      },
    }
  })

  return {
    animationDuration: 400,
    animationDurationUpdate: enlarged ? 560 : 380,
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontSize: enlarged ? 14 : 12, fontFamily: KAITI_FONT, color: '#F5F5DC' },
      backgroundColor: 'rgba(35,27,30,0.92)',
      borderColor: 'rgba(184,134,11,0.68)',
      borderWidth: 1,
    },
    grid: {
      left: enlarged ? 18 : 6,
      right: enlarged ? 20 : 12,
      top: enlarged ? 18 : 8,
      bottom: enlarged ? 16 : 6,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: { color: textMuted, fontSize: enlarged ? 12 : 10, fontFamily: KAITI_FONT },
      axisLine: { lineStyle: { color: 'rgba(245,245,220,0.32)' } },
      axisTick: { lineStyle: { color: 'rgba(245,245,220,0.45)' } },
      splitLine: { lineStyle: { color: 'rgba(245,245,220,0.09)' } }
    },
    yAxis: {
      type: 'category',
      data: names.length ? names : ['—'],
      axisLabel: {
        color: '#F5F5DC',
        fontSize: enlarged ? 14 : 11,
        fontFamily: KAITI_FONT,
        textShadowBlur: enlarged ? 2 : 0,
        textShadowColor: enlarged ? 'rgba(245,245,220,0.45)' : 'transparent',
      },
      axisLine: { lineStyle: { color: 'rgba(245,245,220,0.32)' } },
      axisTick: { lineStyle: { color: 'rgba(245,245,220,0.45)' } },
    },
    series: [
      {
        type: 'bar',
        data: values.length ? dataItems : [0],
        barWidth: enlarged ? '52%' : '55%',
        showBackground: false,
      }
    ]
  }
}

function emitProvinceSelect(name) {
  const province = normalizeProvinceName(name)
  if (!province || province === '—') return
  emit('province-select', province)
  closeZoom()
}

function bindProvinceChartClick(chart) {
  if (!chart) return
  chart.off('click')
  chart.on('click', (params) => {
    const provinceName = params?.name
    emitProvinceSelect(provinceName)
  })
}

function renderZoom() {
  if (!zoomOpen.value || !chartZoom) return
  const n = props.buildings.length
  const max = Math.max(props.totalBuildings, 1)
  const dyn = aggDynasty(props.buildings)
  const prov = aggProvinceTop5(props.buildings)
  if (zoomType.value === 'dynasty') {
    chartZoom.setOption(buildDynastyOption(dyn, true), true)
  } else if (zoomType.value === 'province') {
    chartZoom.setOption(buildProvinceOption(prov, true), true)
    bindProvinceChartClick(chartZoom)
  } else {
    chartZoom.setOption(buildTotalOption(n, max, true), true)
  }
}

function openZoom(type) {
  zoomType.value = type
  zoomOpen.value = true
  nextTick(() => {
    if (!zoomEl.value) return
    if (!chartZoom) {
      chartZoom = echarts.init(zoomEl.value, null, { renderer: 'canvas' })
    }
    renderZoom()
    chartZoom.resize()
  })
}

function closeZoom() {
  zoomOpen.value = false
  if (chartZoom) {
    chartZoom.dispose()
    chartZoom = null
  }
}

function renderAll() {
  const n = props.buildings.length
  const max = Math.max(props.totalBuildings, 1)

  if (chartTotal) {
    chartTotal.setOption(buildTotalOption(n, max), true)
  }

  const dyn = aggDynasty(props.buildings)
  if (chartDynasty) {
    chartDynasty.setOption(buildDynastyOption(dyn), true)
  }

  const prov = aggProvinceTop5(props.buildings)
  if (chartProvince) {
    chartProvince.setOption(buildProvinceOption(prov), true)
  }

  renderZoom()
}

function onResize() {
  try {
    chartTotal?.resize()
    chartDynasty?.resize()
    chartProvince?.resize()
    chartZoom?.resize()
  } catch (e) {
    console.warn('[MapDashboardCharts] resize failed', e)
  }
}

onMounted(() => {
  const initCharts = () => {
    // 确保DOM元素有正确的尺寸
    const checkElementSize = (el) => {
      return el && el.clientWidth > 0 && el.clientHeight > 0
    }

    if (checkElementSize(totalEl.value)) chartTotal = echarts.init(totalEl.value, null, { renderer: 'canvas' })
    if (checkElementSize(dynastyEl.value)) chartDynasty = echarts.init(dynastyEl.value, null, { renderer: 'canvas' })
    if (checkElementSize(provinceEl.value)) chartProvince = echarts.init(provinceEl.value, null, { renderer: 'canvas' })
    bindProvinceChartClick(chartProvince)
    renderAll()
    window.addEventListener('resize', onResize)
  }

  // 先尝试在nextTick中初始化
  nextTick(() => {
    initCharts()
  })
})

watch(
  () => [props.buildings, props.totalBuildings],
  () => renderAll(),
  { deep: true }
)

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  closeZoom()
  chartTotal?.dispose()
  chartDynasty?.dispose()
  chartProvince?.dispose()
  chartTotal = chartDynasty = chartProvince = chartZoom = null
})
</script>

<style scoped>
.map-dash-charts {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.stat-card {
  padding: 12px 14px 14px;
  color: rgba(255, 255, 255, 0.92);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  cursor: zoom-in;
}

.stat-card:hover {
  border-color: rgba(54, 203, 203, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.stat-card--total,
.stat-card--dynasty,
.stat-card--province {
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.stat-card--total::after,
.stat-card--dynasty::after,
.stat-card--province::after {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 12px;
  pointer-events: none;
  box-shadow: 0 0 0 rgba(54, 203, 203, 0);
  transition: box-shadow 0.3s ease;
}

.stat-card--total:hover,
.stat-card--dynasty:hover,
.stat-card--province:hover {
  transform: translateY(-4px);
  border-color: #36CBCB;
  box-shadow: 0 8px 24px rgba(54, 203, 203, 0.4), 0 0 16px rgba(54, 203, 203, 0.25);
}

.stat-card--total:hover .stat-chart--gauge {
  filter: drop-shadow(0 0 4px #f5f5dc);
}

.stat-card:focus-visible {
  outline: 2px solid rgba(54, 203, 203, 0.9);
  outline-offset: 2px;
}

.stat-card--total:hover::after,
.stat-card--dynasty:hover::after,
.stat-card--province:hover::after {
  box-shadow: 0 0 24px rgba(54, 203, 203, 0.35);
}

.stat-header {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}

.stat-chart {
  width: 100%;
  flex: 1;
}

.stat-chart--gauge {
  height: 150px;
}

.stat-chart--pie {
  height: 180px;
}

.stat-chart--bar {
  height: 200px;
}

.stat-number {
  text-align: center;
  margin-top: 4px;
}

.number-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: #36cbcb;
}

.number-unit {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  margin-left: 6px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .map-dash-charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }

  .stat-card {
    padding: 10px 12px;
  }

  .stat-chart--gauge {
    height: 100px;
  }

  .stat-chart--pie {
    height: 120px;
  }

  .stat-chart--bar {
    height: 140px;
  }

  .stat-header {
    font-size: 0.8rem;
  }

  .number-value {
    font-size: 1.1rem;
  }
}

/* 移动端 */
@media (max-width: 768px) {
  .map-dash-charts {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .stat-card {
    padding: 12px 14px;
  }

  .stat-chart--gauge {
    height: 130px;
  }

  .stat-chart--pie {
    height: 150px;
  }

  .stat-chart--bar {
    height: 170px;
  }
}

/* 滚动条美化 */
.map-dash-charts::-webkit-scrollbar {
  width: 6px;
}

.map-dash-charts::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.map-dash-charts::-webkit-scrollbar-thumb {
  background: rgba(54, 203, 203, 0.3);
  border-radius: 3px;
}

.map-dash-charts::-webkit-scrollbar-thumb:hover {
  background: rgba(54, 203, 203, 0.6);
}

.chart-zoom-mask {
  position: fixed;
  inset: 0;
  z-index: 2200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background:
    radial-gradient(120% 90% at 50% 30%, rgba(32, 52, 86, 0.28) 0%, rgba(8, 16, 30, 0.58) 62%, rgba(6, 12, 24, 0.72) 100%);
  backdrop-filter: blur(4px);
  animation: chartMaskFadeIn 0.2s ease-out;
}

.chart-zoom-panel {
  position: relative;
  width: min(960px, 92vw);
  height: min(640px, 86vh);
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(180deg, rgba(59, 45, 51, 0.96) 0%, rgba(45, 35, 39, 0.97) 100%);
  border: 1px solid rgba(184, 134, 11, 0.72);
  border-radius: 8px;
  box-shadow:
    0 14px 36px rgba(16, 10, 8, 0.45),
    inset 0 1px 0 rgba(245, 245, 220, 0.1);
  transform-origin: center;
  animation: chartPanelPopIn 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.chart-zoom-panel::before {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 10px;
  pointer-events: none;
  border: 1px solid rgba(184, 134, 11, 0.35);
  box-shadow: inset 0 0 28px rgba(212, 175, 55, 0.08);
}

.chart-zoom-panel--total::before {
  border-color: rgba(212, 175, 55, 0.42);
}

.chart-zoom-panel--dynasty::before {
  border-color: rgba(184, 134, 11, 0.34);
}

.chart-zoom-panel--province::before {
  border-color: rgba(184, 134, 11, 0.5);
}

.chart-zoom-panel--province {
  background:
    linear-gradient(180deg, rgba(52, 41, 45, 0.98) 0%, rgba(45, 35, 39, 0.99) 100%);
  border-color: rgba(184, 134, 11, 0.8);
  box-shadow:
    0 14px 34px rgba(14, 9, 8, 0.5),
    inset 0 0 24px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(245, 245, 220, 0.08);
}

.chart-zoom-head--province h3 {
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
  color: #f5f5dc;
  text-shadow: 0 0 2px rgba(245, 245, 220, 0.35);
}

.chart-zoom-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.chart-zoom-head h3 {
  margin: 0;
  font-size: 1.12rem;
  color: #f5f5dc;
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
  letter-spacing: 0.02em;
}

.chart-zoom-head--total h3::after {
  content: '';
  display: block;
  height: 1px;
  width: 80%;
  margin-top: 5px;
  background: #b8860b;
}

.chart-zoom-close {
  border: 1px solid rgba(184, 134, 11, 0.65);
  background: rgba(212, 175, 55, 0.12);
  color: #f5f5dc;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-zoom-close:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.88);
}

.chart-zoom-canvas {
  flex: 1;
  min-height: 280px;
  border-radius: 8px;
  background: rgba(45, 35, 39, 0.68);
  border: 1px solid rgba(184, 134, 11, 0.3);
  box-shadow: inset 0 0 22px rgba(0, 0, 0, 0.26);
}

.chart-zoom-canvas--total {
  background-color: #2d2327;
  background-image:
    linear-gradient(120deg, rgba(255, 255, 255, 0.028) 0%, rgba(255, 255, 255, 0) 40%),
    repeating-linear-gradient(
      22deg,
      rgba(202, 170, 116, 0.07) 0px,
      rgba(202, 170, 116, 0.07) 1px,
      rgba(45, 35, 39, 0) 1px,
      rgba(45, 35, 39, 0) 9px
    );
  border-color: rgba(184, 134, 11, 0.52);
}

.chart-zoom-canvas--province {
  background-color: #2d2327;
  background-image:
    radial-gradient(140% 100% at 20% 0%, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 46%),
    repeating-linear-gradient(
      16deg,
      rgba(194, 160, 103, 0.07) 0px,
      rgba(194, 160, 103, 0.07) 1px,
      rgba(45, 35, 39, 0) 1px,
      rgba(45, 35, 39, 0) 12px
    );
  border-color: rgba(184, 134, 11, 0.56);
  box-shadow:
    inset 0 0 28px rgba(0, 0, 0, 0.35),
    0 0 8px rgba(184, 134, 11, 0.16);
}

.chart-zoom-tip {
  margin: 6px 2px 0;
  font-size: 12px;
  color: rgba(245, 245, 220, 0.74);
}

@keyframes chartMaskFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes chartPanelPopIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.975);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>