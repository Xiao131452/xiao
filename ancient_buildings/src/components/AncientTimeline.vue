<template>
  <div class="ancient-timeline">
    <div class="timeline-header">
      <h2 class="timeline-title">中国古建筑历史演变</h2>
      <p class="timeline-subtitle">代表性古建筑 · 共 {{ sortedBuildings.length }} 处</p>

      <div class="heritage-intro-card">
        <div class="heritage-intro-head">
          <h3>🌏 全球格局与里程碑</h3>
          <span class="heritage-badge-inline">截至 2026 年 · 60 项</span>
        </div>
        <p class="heritage-intro-text">
          中国正式加入全球文化遗产保护体系后，持续以制度建设、遗产申报与保护实践推动国际合作，
          逐步形成“总量领先、类别齐全、文化影响力突出”的世界遗产格局。
        </p>
        <div class="heritage-timeline">
          <div class="heritage-point">
            <span class="heritage-year">1985</span>
            <span class="heritage-desc">中国正式加入《保护世界文化和自然遗产公约》，开启融入全球遗产保护体系进程，为后续申遗奠定制度基础。</span>
          </div>
          <div class="heritage-point">
            <span class="heritage-year">1987</span>
            <span class="heritage-desc">长城、故宫、秦始皇陵及兵马俑、莫高窟、周口店北京人遗址、泰山首批入选，实现“零的突破”。</span>
          </div>
          <div class="heritage-point">
            <span class="heritage-year">2019</span>
            <span class="heritage-desc">良渚古城遗址列入名录，以城市格局、水利系统和玉器文明实证中华五千年文明史。</span>
          </div>
          <div class="heritage-point">
            <span class="heritage-year">2026</span>
            <span class="heritage-desc">世界遗产总数增至 60 项，含 41 项文化遗产、15 项自然遗产、4 项双遗产，类别齐全且总量稳居世界前列。</span>
          </div>
        </div>
      </div>
    </div>

    <div class="timeline-container">
      <div class="timeline-line"></div>
      
      <div 
        v-for="(building, index) in sortedBuildings" 
        :key="cardKey(building, index)"
        class="timeline-node"
        :class="{
          'left-side': index % 2 === 0,
          'right-side': index % 2 === 1
        }"
        :ref="el => nodeRefs[index] = el"
        :data-index="index"
        :style="getNodeStyle(index)"
      >
        <div class="node-dot"></div>
        <div class="card-outer">
          <div
            class="node-card timeline-mini-card"
          >
            <div class="card">
              <div
                class="image-wrapper"
                @click="showDetail(building)"
                @touchstart.passive="(e) => onMiniGalleryTouchStart(e, cardKey(building, index))"
                @touchend="(e) => onMiniGalleryTouchEnd(e, building, index)"
              >
                <img
                  :src="miniGallerySrc(building, index)"
                  :alt="building.name"
                  class="building-image"
                />
                <template v-if="galleryCount(building) > 1">
                  <button
                    type="button"
                    class="mini-gallery-nav mini-gallery-nav--prev"
                    aria-label="上一张"
                    @click.stop="bumpMiniSlide(building, index, -1)"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    class="mini-gallery-nav mini-gallery-nav--next"
                    aria-label="下一张"
                    @click.stop="bumpMiniSlide(building, index, 1)"
                  >
                    ›
                  </button>
                  <div class="mini-gallery-dots">
                    <span
                      v-for="(_, di) in galleryList(building)"
                      :key="di"
                      :class="['mini-dot', { active: di === miniSlideIndex(building, index) }]"
                    />
                  </div>
                </template>
                <div class="image-overlay"></div>
                <span v-if="isWorldHeritage(building)" class="heritage-badge">世界文化遗产</span>
                <span class="year-badge">{{ building.year }}</span>
                <!-- 名称与年代：不依赖悬停，随卡片进入视口即自行浮现（整条节点已有滚动动画） -->
                <div class="name-caption" @click.stop="showDetail(building)">
                  <h3 class="building-name">{{ building.name }}</h3>
                  <p class="building-era">{{ eraLine(building) }}</p>
                </div>
              </div>

              <div class="glow-effect"></div>
            </div>
          </div>

          <div class="options-section" @click.stop>
            <button type="button" class="option-btn map-link" @click="handleMapLink(building)">
              <span class="btn-icon">📍</span>
              <span class="btn-text">查看地图</span>
            </button>
            <button type="button" class="option-btn ai-chat" @click="handleAiChat(building)">
              <span class="btn-icon">🤖</span>
              <span class="btn-text">向AI提问</span>
            </button>
          </div>

          <div
            v-if="tooltipForId === building.id"
            class="card-tooltip"
          >
            {{ tooltipText }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!allVisible" class="scroll-hint">
      <span>向下滚动探索更多</span>
      <div class="scroll-arrow">↓</div>
    </div>

    <transition name="fade">
      <div v-if="selectedBuilding" class="detail-overlay" @click="closeDetail">
        <div class="detail-card" @click.stop>
          <button class="close-btn" @click="closeDetail">×</button>
          
          <div v-if="detailGallery.length" class="detail-gallery" @touchstart.passive="onDetailTouchStart" @touchend="onDetailTouchEnd">
            <div class="detail-gallery-viewport">
              <img
                :src="detailGallery[detailImageIndex]"
                :alt="`${selectedBuilding.name} 图 ${detailImageIndex + 1}/${detailGallery.length}`"
              />
              <template v-if="detailGallery.length > 1">
                <button type="button" class="detail-gallery-nav detail-gallery-nav--prev" aria-label="上一张" @click="detailPrev">
                  ‹
                </button>
                <button type="button" class="detail-gallery-nav detail-gallery-nav--next" aria-label="下一张" @click="detailNext">
                  ›
                </button>
              </template>
            </div>
            <div v-if="detailGallery.length > 1" class="detail-gallery-dots">
              <button
                v-for="(_, di) in detailGallery"
                :key="di"
                type="button"
                :class="['detail-dot', { active: di === detailImageIndex }]"
                :aria-label="`第 ${di + 1} 张`"
                @click="detailImageIndex = di"
              />
            </div>
          </div>
          
          <div class="detail-content">
            <div class="detail-header">
              <span class="detail-year">{{ selectedBuilding.year }}</span>
              <span class="detail-dynasty">{{ selectedBuilding.dynasty }}</span>
            </div>
            
            <h2 class="detail-name">{{ selectedBuilding.name }}</h2>
            
            <div class="detail-tags">
              <span class="detail-tag">{{ selectedBuilding.type }}</span>
              <span v-if="selectedBuilding.building_type" class="detail-tag detail-tag--type">{{ selectedBuilding.building_type }}</span>
              <span v-if="isWorldHeritage(selectedBuilding)" class="detail-tag detail-tag--heritage">世界文化遗产</span>
              <span class="detail-tag">{{ selectedBuilding.status }}</span>
            </div>
            
            <div class="detail-location">
              <span>📍</span>
              <span>{{ selectedBuilding.province }} · {{ selectedBuilding.city }}</span>
            </div>
            <div v-if="selectedBuilding.location" class="detail-location detail-location--full">
              <span>📌</span>
              <span>{{ selectedBuilding.location }}</span>
            </div>
            
            <div v-if="selectedBuilding.baidu_address_url" class="detail-links">
              <a
                :href="selectedBuilding.baidu_address_url"
                target="_blank"
                rel="noopener noreferrer"
                class="detail-outlink"
              >
                百度地址 · 地图中打开
              </a>
            </div>
            <div v-if="selectedBuilding.baike_url" class="detail-links">
              <a :href="selectedBuilding.baike_url" target="_blank" rel="noopener noreferrer" class="detail-outlink">
                百度百科词条
              </a>
            </div>
            
            <p class="detail-description">{{ selectedBuilding.description }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue'
import mainCoordsRaw from '@/data/building_coords.json'
import { normalizeBuildingList } from '@/utils/normalizeBuilding.js'

const emit = defineEmits(['goMap', 'aiChat'])

const MAX_TIMELINE_COUNT = 60
const mainNormalized = normalizeBuildingList(mainCoordsRaw)
const importantBuildingNames = new Set([
  '故宫',
  '天坛',
  '应县木塔',
  '赵州桥',
  '大雁塔',
  '小雁塔',
  '兵马俑',
  '白马寺',
  '龙门石窟',
  '少林寺',
  '乐山大佛',
  '都江堰',
  '拙政园',
  '布达拉宫'
])

// 只用于“滚动提示”是否应该隐藏：一旦进入过视口就记住，不会因为上滚而反复出现
const shownNodes = ref(new Set())
const nodeRefs = ref([])
const nodeProgress = ref([]) // 0~1，用于“动态浮现”进度
let observer = null

const tooltipForId = ref(null)
const tooltipText = ref('')

const allVisible = computed(() => shownNodes.value.size >= sortedBuildings.value.length)

const selectedBuilding = ref(null)
const detailImageIndex = ref(0)
let detailTouchX = 0
const DETAIL_AUTOPLAY_MS = 3500
let detailAutoplayTimer = null

const uniqueTimelinePool = computed(() => {
  const seen = new Set()
  const rows = []
  for (const b of mainNormalized) {
    if (!b?.name) continue
    const key = `${b.name}__${b.province || ''}`
    if (seen.has(key)) continue
    seen.add(key)
    rows.push(b)
  }
  return rows
})

const isWorldHeritage = (b) =>
  Array.isArray(b?.heritage_status) &&
  b.heritage_status.some((s) => String(s).includes('世界文化遗产'))

const isImportantBuilding = (b) => {
  if (!b) return false
  if (importantBuildingNames.has(b.name)) return true
  if (Array.isArray(b.heritage_status)) {
    if (b.heritage_status.some((s) => String(s).includes('全国重点文物保护单位'))) return true
  }
  if (typeof b.building_type === 'string' && /(文保单位|历史文化名村|历史文化街区)/.test(b.building_type)) return true
  return false
}

const sortedBuildings = computed(() => {
  const sortByYear = (a, b) => parseYearValue(a.year) - parseYearValue(b.year)
  const pool = uniqueTimelinePool.value

  const worldHeritage = pool.filter(isWorldHeritage).sort(sortByYear)
  const importantOthers = pool.filter((b) => !isWorldHeritage(b) && isImportantBuilding(b)).sort(sortByYear)
  const otherRows = pool.filter((b) => !isWorldHeritage(b) && !isImportantBuilding(b)).sort(sortByYear)

  const selected = []
  const used = new Set()
  const pushRows = (rows) => {
    for (const row of rows) {
      if (selected.length >= MAX_TIMELINE_COUNT) break
      const key = `${row.name}__${row.province || ''}`
      if (used.has(key)) continue
      used.add(key)
      selected.push(row)
    }
  }

  // 1) 先保证纳入世界文化遗产 2) 再补重点古建筑 3) 不足再补其他
  pushRows(worldHeritage)
  pushRows(importantOthers)
  pushRows(otherRows)

  return selected.sort(sortByYear)
})

const detailGallery = computed(() => {
  if (!selectedBuilding.value) return []
  const b = selectedBuilding.value
  if (Array.isArray(b.images) && b.images.length) return b.images
  return b.image ? [b.image] : []
})

watch(selectedBuilding, () => {
  detailImageIndex.value = 0
})

function stopDetailAutoplay() {
  if (!detailAutoplayTimer) return
  window.clearInterval(detailAutoplayTimer)
  detailAutoplayTimer = null
}

function startDetailAutoplay() {
  const n = detailGallery.value.length
  if (!selectedBuilding.value || n < 2) {
    stopDetailAutoplay()
    return
  }
  if (detailAutoplayTimer) return
  detailAutoplayTimer = window.setInterval(() => {
    detailNext()
  }, DETAIL_AUTOPLAY_MS)
}

watch([selectedBuilding, detailGallery], () => {
  stopDetailAutoplay()
  startDetailAutoplay()
}, { deep: true })

function cardKey(building, index) {
  return `${building.id}-${index}`
}

function galleryList(b) {
  if (Array.isArray(b.images) && b.images.length) return b.images
  return b.image ? [b.image] : []
}

function galleryCount(b) {
  return galleryList(b).length
}

const miniSlideByKey = reactive({})
const MINI_AUTOPLAY_MS = 3500
let miniAutoplayTimer = null

function miniSlideIndex(building, index) {
  const k = cardKey(building, index)
  const n = galleryCount(building)
  if (n < 1) return 0
  const i = miniSlideByKey[k] ?? 0
  return ((i % n) + n) % n
}

function miniGallerySrc(building, index) {
  const list = galleryList(building)
  if (!list.length) return ''
  return list[miniSlideIndex(building, index)]
}

function bumpMiniSlide(building, index, delta) {
  const k = cardKey(building, index)
  const n = galleryCount(building)
  if (n < 2) return
  const cur = miniSlideByKey[k] ?? 0
  miniSlideByKey[k] = (cur + delta + n) % n
}

function startMiniAutoplay() {
  if (miniAutoplayTimer) return
  miniAutoplayTimer = window.setInterval(() => {
    sortedBuildings.value.forEach((building, index) => {
      if (galleryCount(building) > 1) {
        bumpMiniSlide(building, index, 1)
      }
    })
  }, MINI_AUTOPLAY_MS)
}

function stopMiniAutoplay() {
  if (!miniAutoplayTimer) return
  window.clearInterval(miniAutoplayTimer)
  miniAutoplayTimer = null
}

let miniTouchX = 0
let miniTouchKey = ''

function onMiniGalleryTouchStart(e, key) {
  miniTouchX = e.changedTouches[0].clientX
  miniTouchKey = key
}

function onMiniGalleryTouchEnd(e, building, index) {
  const k = cardKey(building, index)
  if (k !== miniTouchKey || galleryCount(building) < 2) return
  const d = e.changedTouches[0].clientX - miniTouchX
  if (d > 48) bumpMiniSlide(building, index, -1)
  else if (d < -48) bumpMiniSlide(building, index, 1)
}

function onDetailTouchStart(e) {
  detailTouchX = e.changedTouches[0].clientX
}

function onDetailTouchEnd(e) {
  const n = detailGallery.value.length
  if (n < 2) return
  const d = e.changedTouches[0].clientX - detailTouchX
  if (d > 48) detailPrev()
  else if (d < -48) detailNext()
}

function detailPrev() {
  const n = detailGallery.value.length
  if (!n) return
  detailImageIndex.value = (detailImageIndex.value - 1 + n) % n
}

function detailNext() {
  const n = detailGallery.value.length
  if (!n) return
  detailImageIndex.value = (detailImageIndex.value + 1) % n
}

function parseYearValue(yearStr) {
  if (!yearStr) return 9999
  
  const bcMatch = yearStr.match(/前(\d+)年/)
  if (bcMatch) {
    return -parseInt(bcMatch[1])
  }
  
  const adMatch = yearStr.match(/(\d+)年/)
  if (adMatch) {
    return parseInt(adMatch[1])
  }
  
  return 9999
}

const eraLine = (b) => {
  const parts = [b.dynasty, b.year].filter(Boolean)
  return parts.length ? parts.join(' · ') : ''
}

const triggerTooltip = (id, text) => {
  tooltipText.value = text
  tooltipForId.value = id
  window.setTimeout(() => {
    if (tooltipForId.value === id) {
      tooltipForId.value = null
    }
  }, 2000)
}

const handleMapLink = (building) => {
  emit('goMap', building)
  triggerTooltip(building.id, '已切换到舆图寻迹')
}

const handleAiChat = (building) => {
  emit('aiChat', building)
  triggerTooltip(building.id, '正在打开 AI 对话…')
}

const showDetail = (building) => {
  selectedBuilding.value = building
}

const closeDetail = () => {
  selectedBuilding.value = null
}

const clamp01 = (v) => Math.min(1, Math.max(0, v))

// 根据左右节点和浮现进度，生成“弧线浮现”的transform
const getNodeStyle = (index) => {
  const p = nodeProgress.value[index] ?? 0
  const dir = index % 2 === 0 ? 1 : -1

  // x 使用 cos 形成更像“沿弧线滑入”的轨迹：
  // p=0 时为最大偏移；p=1 时回到 0
  const translateX = dir * 24 * Math.cos((p * Math.PI) / 2)

  // y 从下方缓慢浮现到位
  const translateY = 55 * (1 - p)

  // 轻微缩放增强“浮现”质感
  const scale = 0.98 + 0.02 * p

  // 不完全依赖 opacity= p，让中段更“浮”
  const opacity = Math.pow(p, 0.65)

  return {
    opacity: Number.isFinite(opacity) ? opacity : 0,
    transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
  }
}

onMounted(() => {
  startMiniAutoplay()
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const index = parseInt(entry.target.dataset.index)
      if (!isNaN(index)) {
        if (entry.isIntersecting) {
          shownNodes.value.add(index)
          // 让 Vue 能感知 Set 变更，从而触发 allVisible 重新计算
          shownNodes.value = new Set(shownNodes.value)
        }

        // 将 intersectionRatio 映射到 0~1 浮现进度，ratio 越大越接近“完全浮现”
        // start=0.05 避免极小进入就从底部直接跳起来
        const start = 0.05
        const ratio = entry.intersectionRatio ?? 0
        const p = clamp01((ratio - start) / (1 - start))
        nodeProgress.value[index] = p
      }
    })
  }, {
    // 用更细的阈值让进度在滚动中“动态连续变化”
    threshold: Array.from({ length: 21 }, (_, i) => i / 20),
    rootMargin: '-40px 0px -40px 0px',
  })

  nextTick(() => {
    // 初始化进度数组，保证模板读取不会是 undefined
    nodeProgress.value = new Array(sortedBuildings.value.length).fill(0)
    nodeRefs.value.forEach((el) => {
      if (el) observer.observe(el)
    })
  })
})

onUnmounted(() => {
  stopDetailAutoplay()
  stopMiniAutoplay()
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.ancient-timeline {
  width: 100%;
  min-height: 100vh;
  background: transparent;
  padding: 60px 20px;
  box-sizing: border-box;
  position: relative;
}

.timeline-header {
  text-align: center;
  margin-bottom: 60px;
}

.timeline-title {
  font-size: 36px;
  font-weight: bold;
  color: #233d4d;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.35);
}

.timeline-subtitle {
  color: #526d82;
  font-size: 16px;
  margin: 0;
}

.heritage-intro-card {
  margin: 22px auto 0;
  max-width: 900px;
  text-align: left;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 16px;
  padding: 18px 20px 16px;
  box-shadow: 0 10px 28px rgba(21, 17, 56, 0.25);
  backdrop-filter: blur(8px);
}

.heritage-intro-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.heritage-intro-head h3 {
  margin: 0;
  font-size: 20px;
  color: #233d4d;
  font-weight: 700;
}

.heritage-badge-inline {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #fff;
  background: #2e7d32;
  border-radius: 999px;
  padding: 4px 10px;
  font-weight: 700;
  white-space: nowrap;
}

.heritage-intro-text {
  margin: 0 0 12px;
  color: #6f4e37;
  font-size: 14px;
  line-height: 1.75;
}

.heritage-timeline {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
}

.heritage-point {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
}

.heritage-year {
  display: inline-block;
  font-size: 12px;
  color: #7f4f21;
  font-weight: 700;
  margin-bottom: 4px;
}

.heritage-desc {
  display: block;
  color: #526d82;
  font-size: 13px;
  line-height: 1.55;
}

.timeline-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  padding: 20px 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #FFD700 0%, #D4AF37 50%, #FFD700 100%);
  transform: translateX(-50%);
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
}

.timeline-node {
  position: relative;
  width: 50%;
  padding: 20px 40px;
  box-sizing: border-box;
  /* 默认状态由 getNodeStyle 动态控制（opacity/transform） */
  opacity: 0;
  transform: translateX(0) translateY(55px) scale(0.98);
  transition: opacity 0.2s linear, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  will-change: transform, opacity;
}

.timeline-node.left-side {
  left: 0;
  text-align: right;
  padding-right: 60px;
}

.timeline-node.right-side {
  left: 50%;
  text-align: left;
  padding-left: 60px;
}

.node-dot {
  position: absolute;
  top: 30px;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #FFD700 0%, #D4AF37 100%);
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
  z-index: 10;
}

.timeline-node.left-side .node-dot {
  right: -10px;
}

.timeline-node.right-side .node-dot {
  left: -10px;
}

.card-outer {
  position: relative;
  width: 100%;
  max-width: 280px;
}

.timeline-node.left-side .card-outer {
  margin-left: auto;
}

.timeline-node.right-side .card-outer {
  margin-right: auto;
}

.timeline-mini-card {
  perspective: 1000px;
}

.timeline-mini-card .card {
  position: relative;
  width: 100%;
  min-height: 0;
  height: 160px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.timeline-mini-card .card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.mini-gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.mini-gallery-nav:hover {
  background: rgba(0, 0, 0, 0.72);
}

.mini-gallery-nav--prev {
  left: 6px;
}

.mini-gallery-nav--next {
  right: 6px;
}

.mini-gallery-dots {
  position: absolute;
  bottom: 52px;
  left: 0;
  right: 0;
  display: flex;
  gap: 4px;
  justify-content: center;
  z-index: 4;
  pointer-events: none;
}

.mini-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
}

.mini-dot.active {
  background: #fff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

.building-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline-mini-card .card:hover .building-image {
  transform: scale(1.06) rotate(1deg);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.35) 100%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.timeline-mini-card .card:hover .image-overlay {
  opacity: 1;
}

.name-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 14px 12px 12px;
  background: linear-gradient(0deg, rgba(255, 248, 240, 0.88) 0%, rgba(255, 248, 240, 0.45) 55%, transparent 100%);
  text-align: left;
  pointer-events: auto;
  cursor: pointer;
}

.name-caption .building-name {
  font-size: 16px;
  font-weight: 700;
  color: #233d4d;
  margin: 0 0 4px 0;
  letter-spacing: 0.5px;
  line-height: 1.3;
  text-shadow: 0 1px 4px rgba(255, 255, 255, 0.45);
}

.name-caption .building-era {
  font-size: 11px;
  color: #6f4e37;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.45);
}

.year-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  background: #2e7d32;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.35);
}

.heritage-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  background: #c62828;
  box-shadow: 0 2px 10px rgba(198, 40, 40, 0.35);
}

.options-section {
  position: absolute;
  top: 50%;
  right: -108px;
  transform: translateY(-50%);
  padding: 4px;
  background: rgba(10, 12, 24, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 1;
  transition: all 0.2s ease;
  z-index: 6;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}

.timeline-node.right-side .options-section {
  left: -108px;
  right: auto;
}

.option-btn {
  width: 96px;
  min-height: 30px;
  padding: 6px 8px;
  border: 1px solid rgba(255, 255, 255, 0.58);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.25s ease;
  color: rgba(255, 255, 255, 0.98);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.option-btn.map-link {
  background: rgba(102, 126, 234, 0.72);
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.45);
}

.option-btn.map-link:hover {
  transform: translateY(-2px) scale(1.03);
  background: rgba(102, 126, 234, 0.55);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.45);
}

.option-btn.ai-chat {
  background: rgba(245, 87, 108, 0.72);
  box-shadow: 0 2px 12px rgba(245, 87, 108, 0.45);
}

.option-btn.ai-chat:hover {
  transform: translateY(-2px) scale(1.03);
  background: rgba(245, 87, 108, 0.52);
  box-shadow: 0 6px 16px rgba(245, 87, 108, 0.42);
}

.btn-icon {
  font-size: 13px;
}

.glow-effect {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.75) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.timeline-mini-card .card:hover .glow-effect {
  opacity: 0.25;
}

.card-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 14px;
  background: rgba(26, 26, 26, 0.95);
  color: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  z-index: 20;
  animation: tooltipPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(26, 26, 26, 0.95);
}

@keyframes tooltipPop {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(8px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

.scroll-hint {
  text-align: center;
  padding: 40px 0;
  color: rgba(255, 255, 255, 0.8);
}

.scroll-hint span {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
}

.scroll-arrow {
  font-size: 24px;
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.detail-card {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: white;
  transform: rotate(90deg);
}

.detail-gallery {
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  background: #0f172a;
}

.detail-gallery-viewport {
  position: relative;
  width: 100%;
  height: 250px;
}

.detail-gallery-viewport img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.detail-gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  z-index: 2;
}

.detail-gallery-nav:hover {
  background: rgba(0, 0, 0, 0.65);
}

.detail-gallery-nav--prev {
  left: 12px;
}

.detail-gallery-nav--next {
  right: 12px;
}

.detail-gallery-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 10px 0 14px;
  background: #fff;
}

.detail-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #cbd5e1;
  cursor: pointer;
}

.detail-dot.active {
  background: #667eea;
}

.detail-tag--type {
  background: #e3e8ff;
  color: #4338ca;
}

.detail-tag--heritage {
  background: linear-gradient(135deg, #fde68a 0%, #f59e0b 100%);
  color: #1f2937;
  font-weight: 700;
}

.detail-location--full {
  font-size: 14px;
  line-height: 1.5;
}

.detail-links {
  margin-bottom: 12px;
}

.detail-outlink {
  display: inline-block;
  margin-right: 14px;
  margin-bottom: 6px;
  color: #4f46e5;
  font-weight: 600;
  font-size: 14px;
  text-decoration: underline;
}

.detail-outlink:hover {
  color: #6366f1;
}

.detail-content {
  padding: 24px;
}

.detail-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-year,
.detail-dynasty {
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
}

.detail-year {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.detail-dynasty {
  background: #f0f0f0;
  color: #666;
}

.detail-name {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
}

.detail-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.detail-tag {
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 500;
  background: #e8f5e9;
  color: #333;
}

.detail-location {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #666;
  font-size: 15px;
}

.detail-description {
  color: #666;
  line-height: 1.8;
  margin: 0;
  font-size: 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .heritage-intro-card {
    margin-top: 16px;
    padding: 14px 14px 12px;
    border-radius: 12px;
  }

  .heritage-intro-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .heritage-intro-head h3 {
    font-size: 16px;
  }

  .heritage-intro-text {
    font-size: 13px;
  }

  .heritage-timeline {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .timeline-node {
    width: 100%;
    left: 0 !important;
    padding: 15px 30px 15px 40px !important;
    text-align: left !important;
  }
  
  .timeline-line {
    left: 20px;
  }
  
  .timeline-node .node-dot {
    left: 10px !important;
    right: auto !important;
  }
  
  .card-outer {
    max-width: 100%;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .options-section {
    top: auto;
    right: 8px;
    bottom: 8px;
    transform: none;
    flex-direction: row;
  }

  .option-btn {
    width: auto;
    min-width: 86px;
    font-size: 10px;
    padding: 5px 7px;
  }
}
</style>