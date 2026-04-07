<template>
  <div
    class="map-view"
    :class="{
      'map-view--animation-fs': currentTab === 'animation',
      'map-view--bg-map': currentTab === 'map',
      'map-view--bg-stats-game': currentTab === 'stats' || currentTab === 'game',
      'map-view--bg-timeline': currentTab === 'timeline',
      'map-view--stats-books-focus': currentTab === 'stats' || currentTab === 'game',
      'map-view--game-tab': currentTab === 'game'
    }"
  >
    <div class="page-tabs">
      <button 
        v-for="tab in pageTabs" 
        :key="tab.id"
        :class="['tab-btn', `tab-btn--${tab.id}`, { active: currentTab === tab.id }]"
        @click="switchTab(tab.id)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
      <button
        v-if="currentTab === 'map' && timelineReturnState.available"
        class="timeline-return-btn"
        type="button"
        @click="backToTimelineOrigin"
      >
        ↩ 返回天下名迹原位置
      </button>
    </div>

    <GameCollectibleCards :visible="currentTab === 'game'" />
    
    <div
      class="map-content"
      :class="{
        'timeline-mode': currentTab === 'timeline',
        'map-content--animation-fs': currentTab === 'animation',
        'map-content--map-dashboard': currentTab === 'map',
        'map-content--stats-focus': currentTab === 'stats' || currentTab === 'game'
      }"
    >
      <div v-show="currentTab === 'map'" :key="`map-tab-${mapRefreshKey}`" class="map-tab-dashboard">
        <FloatingFilterPanel
          :filters="filters"
          :buildings="buildings"
          @update-filters="updateFiltersFromPanel"
        />

        <div class="main-layout">
          <div class="map-section">
            <div class="map-container map-container--dashboard">
              <BuildingMap3D
                :buildings="filteredBuildings"
                :selected-province="selectedProvince"
                :filters="filters"
                @building-click="handleBuildingClick"
                @province-click="handleProvinceClick"
                @update:selectedProvince="selectedProvince = $event"
              />
            </div>

            <div class="building-list building-list--dashboard" v-if="selectedBuilding || selectedProvince !== 'china'">
          <div class="list-header">
            <h3 v-if="selectedBuilding">{{ selectedBuilding.name }}</h3>
            <h3 v-else>{{ selectedProvince }}古建筑</h3>
            <button class="close-btn" @click="closeDetail">×</button>
          </div>
          
          <div v-if="selectedBuilding" class="building-detail">
            <div
              v-if="selectedBuildingGallery.length"
              class="detail-gallery"
              @touchstart.passive="onDetailGalleryTouchStart"
              @touchend="onDetailGalleryTouchEnd"
            >
              <div class="gallery-viewport">
                <img
                  :src="selectedBuildingGallery[detailImageIndex]"
                  :alt="`${selectedBuilding.name} 图 ${detailImageIndex + 1}/${selectedBuildingGallery.length}`"
                />
                <button
                  v-if="selectedBuildingGallery.length > 1"
                  type="button"
                  class="gallery-nav gallery-nav--prev"
                  aria-label="上一张"
                  @click="detailImagePrev"
                >
                  ‹
                </button>
                <button
                  v-if="selectedBuildingGallery.length > 1"
                  type="button"
                  class="gallery-nav gallery-nav--next"
                  aria-label="下一张"
                  @click="detailImageNext"
                >
                  ›
                </button>
              </div>
              <div v-if="selectedBuildingGallery.length > 1" class="gallery-dots">
                <button
                  v-for="(_, i) in selectedBuildingGallery"
                  :key="i"
                  type="button"
                  :class="['gallery-dot', { active: i === detailImageIndex }]"
                  :aria-label="`第 ${i + 1} 张`"
                  @click="detailImageIndex = i"
                />
              </div>
            </div>
            <div class="detail-info">
              <div class="info-row">
                <span class="label">朝代：</span>
                <span class="value">{{ selectedBuilding.dynasty }}</span>
              </div>
              <div class="info-row">
                <span class="label">形制：</span>
                <span class="value">{{ selectedBuilding.type }}</span>
              </div>
              <div v-if="selectedBuilding.building_type" class="info-row">
                <span class="label">建筑类型：</span>
                <span class="value">{{ selectedBuilding.building_type }}</span>
              </div>
              <div class="info-row">
                <span class="label">年代：</span>
                <span class="value">{{ selectedBuilding.year }}</span>
              </div>
              <div class="info-row">
                <span class="label">位置：</span>
                <span class="value">{{ selectedBuilding.city }}</span>
              </div>
              <div v-if="selectedBuilding.location" class="info-row">
                <span class="label">地址：</span>
                <span class="value">{{ selectedBuilding.location }}</span>
              </div>
              <div class="info-row">
                <span class="label">状态：</span>
                <span class="value" :class="getStatusClass(selectedBuilding.status)">
                  {{ selectedBuilding.status }}
                </span>
              </div>
              <div v-if="selectedBuilding.baidu_address_url" class="info-row info-row--link">
                <span class="label">百度地址：</span>
                <a
                  class="value link-out"
                  :href="selectedBuilding.baidu_address_url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  在百度地图中打开
                </a>
              </div>
              <div v-if="selectedBuilding.baike_url" class="info-row info-row--link">
                <span class="label">百科：</span>
                <a
                  class="value link-out"
                  :href="selectedBuilding.baike_url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  百度百科词条
                </a>
              </div>
              <div class="info-description">
                <span class="label">简介：</span>
                <p>{{ selectedBuilding.description }}</p>
              </div>
            </div>
          </div>
          
          <div v-else class="province-buildings">
            <div 
              v-for="building in provinceBuildings" 
              :key="building.id"
              class="building-item"
              @click="handleBuildingClick(building)"
            >
              <div class="item-image">
                <img :src="building.image" :alt="building.name" />
              </div>
              <div class="item-info">
                <h4>{{ building.name }}</h4>
                <p class="item-meta">
                  {{ building.dynasty }} · {{ building.type
                  }}<template v-if="building.building_type"> · {{ building.building_type }}</template>
                </p>
                <p class="item-desc">{{ building.description }}</p>
              </div>
            </div>
          </div>
            </div>

            <div class="map-legend-inline glass-effect">
              <span class="legend-item-inline">
                <span class="legend-dot" style="background-color: #ff4444" />
                古建筑点位
              </span>
              <span class="legend-item-inline">
                <span class="legend-flag">🚩</span>
                省份标记
              </span>
            </div>
          </div>

          <div class="stats-section">
            <MapDashboardCharts
              :buildings="filteredBuildings"
              :total-buildings="totalBuildings"
              @province-select="onDashboardProvinceSelect"
            />
          </div>
        </div>

        <div class="mobile-stats">
          <MapDashboardCharts
            :buildings="filteredBuildings"
            :total-buildings="totalBuildings"
            @province-select="onDashboardProvinceSelect"
          />
        </div>
      </div>
      
      <div class="animation-panel" v-show="currentTab === 'animation'">
        <div class="animation-placeholder">
          <div class="animation-showcase animation-showcase--taihedian">
            <div class="animation-3d-column">
              <iframe
                class="taihedian-exhibit-iframe"
                src="/models/index_1.html"
                title="故宫太和殿3D数字展馆"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="stats-panel" v-show="currentTab === 'stats'">
        <div class="stats-content-wrapper">
          <section class="gujian-data-analysis-books" aria-labelledby="gujian-data-analysis-books-title">
            <h2 id="gujian-data-analysis-books-title" class="gujian-data-analysis-books__title">数据分析 · 典籍参阅</h2>
            <DataAnalysisArchive />
          </section>
        </div>
      </div>
      
      <div class="timeline-panel" v-show="currentTab === 'timeline'">
        <AncientTimeline @go-map="onTimelineGoMap" @ai-chat="onTimelineAiChat" />
      </div>
      
      <div v-if="currentTab === 'game'" class="game-panel game-panel--luxe">
        <header class="game-luxe-head">
          <span class="game-luxe-head__mark" aria-hidden="true" />
          <div class="game-luxe-head__text">
            <h2 class="game-luxe-head__title">亭台雅趣</h2>
            <p class="game-luxe-head__sub">古建三试 · 收集名迹卡牌</p>
          </div>
        </header>
        <div class="game-content game-content--embed-only game-content--trio game-content--luxe">
          <p class="game-rules-intro game-rules-intro--luxe">
            <span class="game-rules-intro__label">规则：</span>
            共三款小游戏；在对应游戏中结束一次会话后，将先弹出胜利画面，收下后解锁对应古建筑卡牌；三张集齐即为通关。
          </p>
          <div class="game-trio-row game-trio-row--luxe">
            <article class="game-card-luxe" aria-label="小游戏一">
              <h3 class="game-card-luxe__title">徽州古建修复</h3>
              <div class="game-card-luxe__frame">
                <span class="game-card-luxe__knob" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--tl" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--tr" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--bl" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--br" aria-hidden="true" />
                <div class="game-card-luxe__spotlight" aria-hidden="true" />
                <div class="game-card-luxe__body">
                  <HuizhouHeritageGameEmbed compact-slot />
                </div>
                <div class="game-card-luxe__meter" aria-hidden="true">
                  <span
                    class="game-card-luxe__meter-fill"
                    :style="{ width: gameCollectUnlocked[0] ? '100%' : '0%' }"
                  />
                </div>
              </div>
              <p class="game-card-luxe__status">{{ gameCollectUnlocked[0] ? '已完成' : '待挑战' }}</p>
            </article>
            <article class="game-card-luxe" aria-label="小游戏二">
              <h3 class="game-card-luxe__title">营造消消乐</h3>
              <div class="game-card-luxe__frame">
                <span class="game-card-luxe__knob" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--tl" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--tr" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--bl" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--br" aria-hidden="true" />
                <div class="game-card-luxe__spotlight" aria-hidden="true" />
                <div class="game-card-luxe__body">
                  <YingzaoMatchGameEmbed compact-slot />
                </div>
                <div class="game-card-luxe__meter" aria-hidden="true">
                  <span
                    class="game-card-luxe__meter-fill"
                    :style="{ width: gameCollectUnlocked[1] ? '100%' : '0%' }"
                  />
                </div>
              </div>
              <p class="game-card-luxe__status">{{ gameCollectUnlocked[1] ? '已完成' : '待挑战' }}</p>
            </article>
            <article class="game-card-luxe" aria-label="小游戏三 · 大明总造办">
              <h3 class="game-card-luxe__title">大明总造办：规划与营缮</h3>
              <div class="game-card-luxe__frame">
                <span class="game-card-luxe__knob" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--tl" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--tr" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--bl" aria-hidden="true" />
                <span class="game-card-luxe__corner game-card-luxe__corner--br" aria-hidden="true" />
                <div class="game-card-luxe__spotlight" aria-hidden="true" />
                <div class="game-card-luxe__body">
                  <Game2ZhaochaEmbed compact-slot />
                </div>
                <div class="game-card-luxe__meter" aria-hidden="true">
                  <span
                    class="game-card-luxe__meter-fill"
                    :style="{ width: gameCollectUnlocked[2] ? '100%' : '0%' }"
                  />
                </div>
              </div>
              <p class="game-card-luxe__status">{{ gameCollectUnlocked[2] ? '已完成' : '待挑战' }}</p>
            </article>
          </div>
          <GameRewardDeck />
        </div>
      </div>
    </div>

    <ChatWindow ref="chatWindowRef" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import BuildingMap3D from '../components/map/BuildingMap3D.vue'
import MapDashboardCharts from '../components/map/MapDashboardCharts.vue'
import FloatingFilterPanel from '../components/map/FloatingFilterPanel.vue'
import ChatWindow from '../components/chat/ChatWindow.vue'
import AncientTimeline from '../components/AncientTimeline.vue'
import DataAnalysisArchive from '../components/books/DataAnalysisArchive.vue'
import HuizhouHeritageGameEmbed from '../components/game/HuizhouHeritageGameEmbed.vue'
import YingzaoMatchGameEmbed from '../components/game/YingzaoMatchGameEmbed.vue'
import Game2ZhaochaEmbed from '../components/game/Game2ZhaochaEmbed.vue'
import GameCollectibleCards from '../components/game/GameCollectibleCards.vue'
import GameRewardDeck from '../components/game/GameRewardDeck.vue'
import {
  gameCollectUnlocked,
  hydrateGameCollectUnlocked,
} from '../composables/gameCollectibleState.js'
import buildingData from '../data/building_coords.json'
import { normalizeBuildingList } from '../utils/normalizeBuilding.js'
import { normalizeProvinceName } from '../utils/provinceUtils.js'

const buildings = ref(normalizeBuildingList(buildingData))
const selectedProvince = ref('china')
const selectedBuilding = ref(null)
const filters = ref({
  dynasty: '',
  province: '',
  status: ''
})

const currentTab = ref('map')
const mapRefreshKey = ref(0)
const chatWindowRef = ref(null)
const timelineReturnState = ref({
  available: false,
  scrollY: 0,
})

const buildingTypes = ['宫殿', '民居', '塔', '桥梁', '园林', '祠庙', '陵墓', '寺庙', '石窟', '道教建筑', '佛教建筑', '水利工程']

const normalizeDynastyName = (input) => {
  if (!input) return ''
  let raw = String(input).trim()
  if (!raw) return ''
  if (/(未知|不详|待考|约|暂缺|其它|其他|无|现代|当代|史前|夏商周|先秦两汉)/.test(raw)) return ''
  if (/[\/、,，\-至]/.test(raw)) return ''

  raw = raw
    .replace(/\s+/g, '')
    .replace(/[（(].*?[)）]/g, '')
    .replace(/(朝代|王朝|时期|时代|年间|初期|中期|中后期|后期|晚期|遗构)/g, '')

  const aliases = {
    西汉: '汉',
    东汉: '汉',
    北宋: '宋',
    南宋: '宋',
    北魏: '南北朝',
    东魏: '南北朝',
    西魏: '南北朝',
    北齐: '南北朝',
    北周: '南北朝',
    后梁: '五代',
    后唐: '五代',
    后晋: '五代',
    后汉: '五代',
    后周: '五代'
  }
  if (aliases[raw]) return aliases[raw]

  const canonical = ['秦', '汉', '三国', '晋', '南北朝', '隋', '唐', '五代', '辽', '宋', '金', '元', '明', '清', '民国']
  if (canonical.includes(raw)) return raw

  const hit = canonical.find((d) => raw.includes(d))
  return hit || ''
}

const detailImageIndex = ref(0)
const DETAIL_AUTOPLAY_MS = 3500
let detailAutoplayTimer = null
const selectedBuildingGallery = computed(() => {
  if (!selectedBuilding.value) return []
  const b = selectedBuilding.value
  if (Array.isArray(b.images) && b.images.length) return b.images
  return b.image ? [b.image] : []
})

watch(selectedBuilding, () => {
  detailImageIndex.value = 0
})

const stopDetailAutoplay = () => {
  if (!detailAutoplayTimer) return
  clearInterval(detailAutoplayTimer)
  detailAutoplayTimer = null
}

const startDetailAutoplay = () => {
  const n = selectedBuildingGallery.value.length
  if (!selectedBuilding.value || n < 2) {
    stopDetailAutoplay()
    return
  }
  if (detailAutoplayTimer) return
  detailAutoplayTimer = setInterval(() => {
    detailImageNext()
  }, DETAIL_AUTOPLAY_MS)
}

watch([selectedBuilding, selectedBuildingGallery], () => {
  stopDetailAutoplay()
  startDetailAutoplay()
}, { deep: true })

let detailGalleryTouchStartX = 0
const onDetailGalleryTouchStart = (e) => {
  detailGalleryTouchStartX = e.changedTouches[0].clientX
}
const onDetailGalleryTouchEnd = (e) => {
  const n = selectedBuildingGallery.value.length
  if (n < 2) return
  const d = e.changedTouches[0].clientX - detailGalleryTouchStartX
  if (d > 56) detailImagePrev()
  else if (d < -56) detailImageNext()
}

const detailImagePrev = () => {
  const n = selectedBuildingGallery.value.length
  if (!n) return
  detailImageIndex.value = (detailImageIndex.value - 1 + n) % n
}

const detailImageNext = () => {
  const n = selectedBuildingGallery.value.length
  if (!n) return
  detailImageIndex.value = (detailImageIndex.value + 1) % n
}

const timelinePeriods = computed(() => {
  const periods = [
    {
      period: '公元前221年 - 公元220年',
      title: '秦汉时期',
      description: '中国古建筑体系的形成期，奠定了后世建筑的基本格局',
      features: ['统一度量衡', '标准化建筑构件', '大规模宫殿建筑', '陵墓建筑兴起'],
      buildings: buildings.value.filter(b => ['秦', '汉', '东汉'].includes(b.dynasty))
    },
    {
      period: '公元220年 - 公元589年',
      title: '魏晋南北朝',
      description: '佛教建筑传入，塔寺建筑大量出现，建筑风格多样化',
      features: ['佛教建筑兴起', '石窟艺术发展', '园林建筑萌芽', '木结构技术进步'],
      buildings: buildings.value.filter(b => ['北魏', '魏'].includes(b.dynasty))
    },
    {
      period: '公元589年 - 公元907年',
      title: '隋唐时期',
      description: '中国古建筑的成熟期，建筑技术达到高峰，风格雄浑大气',
      features: ['斗拱技术成熟', '建筑规模宏大', '城市规划完善', '建筑艺术精湛'],
      buildings: buildings.value.filter(b => ['隋', '唐'].includes(b.dynasty))
    },
    {
      period: '公元907年 - 公元1279年',
      title: '宋辽金时期',
      description: '建筑风格转向精致细腻，建筑技术规范化，园林艺术发展',
      features: ['建筑规范制定', '园林艺术繁荣', '砖石建筑增多', '装饰工艺精湛'],
      buildings: buildings.value.filter(b => ['宋', '辽', '北宋'].includes(b.dynasty))
    },
    {
      period: '公元1279年 - 公元1912年',
      title: '明清时期',
      description: '中国古建筑的集大成时期，建筑技术达到顶峰，现存古建筑最多',
      features: ['建筑技术完善', '装饰工艺丰富', '园林艺术巅峰', '建筑类型齐全'],
      buildings: buildings.value.filter(b => ['明', '清'].includes(b.dynasty))
    }
  ]
  
  return periods
})

const classicBuildings = ['故宫', '天坛', '应县木塔', '赵州桥', '大雁塔', '小雁塔', '兵马俑', '白马寺', '龙门石窟', '少林寺', '乐山大佛', '都江堰', '拙政园', '布达拉宫']

const isClassicBuilding = (name) => {
  return classicBuildings.includes(name)
}

const dynastyOrder = {
  秦: 1,
  汉: 2,
  三国: 3,
  晋: 4,
  南北朝: 5,
  隋: 6,
  唐: 7,
  五代: 8,
  辽: 9,
  宋: 10,
  金: 11,
  元: 12,
  明: 13,
  清: 14,
  民国: 15
}

const isWorldHeritageBuilding = (building) => {
  const hs = Array.isArray(building?.heritage_status) ? building.heritage_status : []
  return hs.some((s) => String(s).includes('世界文化遗产'))
}

const isKeyProtectedBuilding = (building) => {
  const hs = Array.isArray(building?.heritage_status) ? building.heritage_status : []
  const bt = String(building?.building_type || '')
  return hs.some((s) => /全国重点文物保护单位|重点文物/.test(String(s))) || /全国重点文物保护单位|重点文物/.test(bt)
}

const isUnknownDynastyBuilding = (building) => {
  return normalizeDynastyName(building?.dynasty) === ''
}

const isOtherTypeBuilding = (building) => {
  const txt = `${building?.type || ''} ${building?.building_type || ''}`
  return /(其他|其它|未知|不详|未分类|无类型|待定)/.test(txt)
}

const getProvinceBuildingRank = (building) => {
  // 朝代不明/形制“其他”统一压到列表末尾
  if (isUnknownDynastyBuilding(building) || isOtherTypeBuilding(building)) return 3
  // 世界文化遗产优先
  if (isWorldHeritageBuilding(building)) return 0
  // 重点文物与经典名迹次优先
  if (isKeyProtectedBuilding(building) || isClassicBuilding(building?.name)) return 1
  // 其余正常项
  return 2
}

const pageTabs = ref([
  { id: 'animation', label: '绘影丹楹', icon: '🎬' },
  { id: 'map', label: '舆图寻迹', icon: '🗺️' },
  { id: 'stats', label: '楹梁史话', icon: '📊' },
  { id: 'timeline', label: '天下名迹', icon: '📜' },
  { id: 'game', label: '亭台雅趣', icon: '🎮' }
])

const filteredBuildings = computed(() => {
  return buildings.value.filter(building => {
    if (filters.value.dynasty && normalizeDynastyName(building.dynasty) !== filters.value.dynasty) {
      return false
    }
    if (filters.value.province && normalizeProvinceName(building.province) !== filters.value.province) {
      return false
    }
    if (filters.value.status && building.status !== filters.value.status) {
      return false
    }
    return true
  })
})

const provinceBuildings = computed(() => {
  return filteredBuildings.value
    .filter(building =>
      normalizeProvinceName(building.province) === selectedProvince.value
    )
    .sort((a, b) => {
      const rankDiff = getProvinceBuildingRank(a) - getProvinceBuildingRank(b)
      if (rankDiff !== 0) return rankDiff

      const da = dynastyOrder[normalizeDynastyName(a?.dynasty)] || 999
      const db = dynastyOrder[normalizeDynastyName(b?.dynasty)] || 999
      if (da !== db) return da - db

      return String(a?.name || '').localeCompare(String(b?.name || ''), 'zh-Hans-CN')
    })
})

const totalBuildings = computed(() => buildings.value.length)

const updateFiltersFromPanel = (nextFilters) => {
  filters.value = {
    dynasty: nextFilters?.dynasty || '',
    province: nextFilters?.province || '',
    status: nextFilters?.status || ''
  }
}

const handleBuildingClick = (building) => {
  selectedBuilding.value = building
}

const handleProvinceClick = (province) => {
  selectedProvince.value = province
  selectedBuilding.value = null
}

const onDashboardProvinceSelect = (province) => {
  if (!province) return
  selectedProvince.value = province
  selectedBuilding.value = null
}

const onTimelineGoMap = (building) => {
  timelineReturnState.value = {
    available: true,
    scrollY: window.scrollY || document.documentElement.scrollTop || 0,
  }
  if (currentTab.value !== 'map') mapRefreshKey.value += 1
  currentTab.value = 'map'
  filters.value = {
    dynasty: '',
    province: '',
    status: ''
  }
  const p = normalizeProvinceName(building.province)
  selectedProvince.value = p || 'china'
  selectedBuilding.value = building
}

const backToTimelineOrigin = async () => {
  const y = timelineReturnState.value.scrollY || 0
  currentTab.value = 'timeline'
  selectedBuilding.value = null
  await nextTick()
  window.scrollTo({ top: y, behavior: 'smooth' })
}

const onTimelineAiChat = (building) => {
  const p = normalizeProvinceName(building.province)
  chatWindowRef.value?.openAndAsk?.(
    `请介绍一下古建筑「${building.name}」（${building.city || ''}，${building.dynasty || ''}，${p || ''}）`
  )
}

const backToChina = () => {
  selectedProvince.value = 'china'
  selectedBuilding.value = null
}

const closeDetail = () => {
  selectedBuilding.value = null
  selectedProvince.value = 'china'
}

const getStatusClass = (status) => {
  return status === '保存完好' ? 'status-good' : 'status-rebuilt'
}

const switchTab = (tabId) => {
  const prevTab = currentTab.value
  if (tabId === 'map' && prevTab !== 'map') {
    mapRefreshKey.value += 1
  }
  currentTab.value = tabId
}

watch(currentTab, (t) => {
  if (t === 'game') hydrateGameCollectUnlocked()
})

onMounted(() => {
  hydrateGameCollectUnlocked()
  console.log('MapView mounted with', buildings.value.length, 'buildings')
})

onUnmounted(() => {
  stopDetailAutoplay()
})
</script>

<style scoped>
.map-view {
  width: 100%;
  min-height: 100vh;
  background: transparent;
  padding: 0;
}

.map-view--stats-books-focus {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.map-view--stats-books-focus .map-content.map-content--stats-focus {
  flex: 1;
  min-height: 0;
}

.map-view--bg-map {
  /* 图片缺失或加载失败时仍有底色，避免整页像「纯白空壳」 */
  background-color: #1a2d4a;
  background-image: url('/images/tu1.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
}

.map-view--bg-stats-game {
  background-image: url('/images/tu2.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
}

/* 亭台雅趣 Tab：深色鎏金底，与统计页共用 tu2 时再叠压色 */
.map-view.map-view--game-tab.map-view--bg-stats-game {
  background-color: #14110e;
  background-image:
    linear-gradient(165deg, rgba(26, 22, 19, 0.92) 0%, rgba(18, 15, 12, 0.96) 45%, rgba(12, 10, 8, 0.98) 100%),
    url('/images/tu2.jpg');
  background-blend-mode: normal, multiply;
}

.map-view--bg-timeline {
  background-image: url('/images/tu3.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
}

/* 绘影丹楹 Tab：3D 展示区占满视口（保留顶部 Tab 切换） */
.map-view--animation-fs {
  --map-tabs-bar-height: 88px;
  min-height: 100dvh;
  background: url('/images/tu3.jpg') center / cover no-repeat fixed;
}

.map-view--animation-fs .page-tabs {
  position: static;
  top: auto;
  z-index: auto;
  background: transparent;
  backdrop-filter: none;
  border-bottom: none;
}

.map-content.map-content--animation-fs {
  max-width: none;
  margin: 0;
  padding: 0;
  display: block;
  min-height: 0;
}

.map-view--animation-fs .animation-panel {
  position: fixed;
  left: 0;
  right: 0;
  top: var(--map-tabs-bar-height);
  bottom: 0;
  z-index: 100;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-view--animation-fs .animation-placeholder {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  text-align: left;
}

.map-view--animation-fs .animation-showcase {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin: 0;
  align-items: stretch;
}

.map-view--animation-fs .animation-3d-column {
  grid-column: auto;
  min-height: 0;
  height: 100%;
}

.map-view--animation-fs .taihedian-exhibit-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
}

.carousel-header {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background: #1a1a2e;
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.slide-content {
  text-align: center;
  color: white;
  padding: 40px;
  max-width: 1200px;
  width: 100%;
}

.slide-content h1 {
  font-size: 3rem;
  margin-bottom: 16px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.8s ease-out;
}

.subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 30px;
  animation: slideUp 0.8s ease-out 0.2s both;
}

.slide-image {
  width: 100%;
  height: 250px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: fadeIn 1s ease-out 0.4s both;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.carousel-indicators button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.carousel-indicators button.active {
  background: white;
  transform: scale(1.2);
}

.carousel-arrows {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 10;
}

.arrow {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid white;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.page-tabs {
  position: static;
  top: auto;
  right: auto;
  z-index: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 0;
  background: transparent;
  backdrop-filter: none;
}

.page-tabs button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f8f4e9;
  border: 1px solid #d8ccb8;
  border-radius: 10px;
  color: #6f4e37;
  cursor: pointer;
  font-size: 0.86rem;
  transition: all 0.25s ease;
  min-width: 112px;
  justify-content: flex-start;
}

.page-tabs button:hover {
  border-color: #bfa88d;
}

.page-tabs button.active {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

.timeline-return-btn {
  margin-left: 6px;
  padding: 8px 12px;
  border: 1px solid #ccbfa9;
  border-radius: 10px;
  background: linear-gradient(180deg, #f6f0e2 0%, #eadfc8 100%);
  color: #6f4e37;
  cursor: pointer;
  font-size: 0.84rem;
  transition: all 0.2s ease;
}

.timeline-return-btn:hover {
  transform: translateY(-1px);
  border-color: #b8a384;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
}

/* 1. 绘影丹楹 🎬 */
.page-tabs .tab-btn--animation.active {
  background: #7968b0;
  border-color: #ffffff;
  color: #ffffff;
}

/* 2. 舆图寻迹 🗺️ */
.page-tabs .tab-btn--map.active {
  background: #4a6fe3;
  border-color: #ffffff;
  color: #ffffff;
}

/* 3. 楹梁史话 📊 */
.page-tabs .tab-btn--stats.active {
  background: #81c784;
  border-color: #ffffff;
  color: #ffffff;
}

/* 4. 天下名迹 📜 */
.page-tabs .tab-btn--timeline.active {
  background: #bcaaa4;
  border-color: #ffffff;
  color: #ffffff;
}

/* 5. 亭台雅趣 🎮 */
.page-tabs .tab-btn--game.active {
  background: linear-gradient(180deg, #a08030 0%, #6b5218 48%, #4a3810 100%);
  border-color: rgba(212, 175, 55, 0.85);
  color: #fffbeb;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 248, 220, 0.25);
}

.tab-icon {
  font-size: 1rem;
}

.tab-label {
  font-weight: 500;
}

.map-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 40px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

.map-content.map-content--map-dashboard {
  display: block;
  max-width: 1720px;
  padding: 28px 28px 44px;
}

.map-content.map-content--stats-focus {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  width: 100%;
  padding: 24px 32px 40px;
  box-sizing: border-box;
}

/* 亭台雅趣：三列并排时需更宽容器 */
.map-content.map-content--stats-focus .game-panel {
  width: 100%;
  max-width: min(100%, 1720px);
  padding: 0;
  box-sizing: border-box;
}

.map-tab-dashboard {
  background: transparent;
  border-radius: 0;
  overflow: visible;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
}

.main-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  min-height: 0;
}

.map-section {
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
}

.map-container--dashboard {
  height: 100%;
  min-height: 520px;
}

.stats-section {
  display: none;
}

.mobile-stats {
  display: block;
  height: auto;
  max-height: 40vh;
  overflow-y: auto;
  background: rgba(10, 10, 30, 0.8);
  border-top: 1px solid rgba(54, 203, 203, 0.2);
  padding: 16px;
}

.map-legend-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 12px 18px;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.9);
}

.legend-item-inline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.map-legend-inline .legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.map-legend-inline .legend-flag {
  font-size: 1rem;
}

@media (min-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr 380px;
    gap: 12px;
    padding: 12px;
  }

  .map-section {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(54, 203, 203, 0.2);
  }

  .stats-section {
    display: block;
    min-width: 0;
  }

  .mobile-stats {
    display: none;
  }

  .building-list--dashboard {
    position: absolute;
    right: 14px;
    top: 14px;
    width: min(360px, 42%);
    max-height: calc(100% - 28px);
    z-index: 20;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(10px);
  }
}

@media (min-width: 1440px) {
  .main-layout {
    grid-template-columns: 1fr 420px;
  }
}

@media (min-width: 1920px) {
  .main-layout {
    grid-template-columns: 1fr 440px;
  }
}

/* 当tab是timeline时，使用flex居中布局 */
.map-content.timeline-mode {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: none;
  margin: 0;
  padding: 0;
}

.filters-panel {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  height: fit-content;
}

.filters-panel h3 {
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  color: #333;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-buttons button {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.3s;
}

.filter-buttons button:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-buttons button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.reset-btn {
  width: 100%;
  padding: 12px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: #e5e7eb;
  color: #333;
}

.filter-result {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.result-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.result-count {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
}

.result-text {
  font-size: 0.9rem;
  color: #666;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  font-size: 0.85rem;
}

.tag-close {
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.tag-close:hover {
  opacity: 1;
}

.map-main {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
}

.map-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  height: 600px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.back-to-china {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.back-btn {
  padding: 10px 20px;
  background: #3a7cae;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #2d5f8a;
}

.building-list {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 600px;
  overflow-y: auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.list-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #333;
}

.building-detail {
  padding: 16px;
}

.detail-gallery {
  margin-bottom: 12px;
}

.gallery-viewport {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: #0f172a;
}

.gallery-viewport img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.gallery-nav:hover {
  background: rgba(0, 0, 0, 0.65);
}

.gallery-nav--prev {
  left: 8px;
}

.gallery-nav--next {
  right: 8px;
}

.gallery-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-top: 8px;
}

.gallery-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #cbd5e1;
  cursor: pointer;
}

.gallery-dot.active {
  background: #667eea;
}

.info-row--link .label {
  min-width: 72px;
}

.link-out {
  color: #4f46e5;
  text-decoration: underline;
  font-weight: 600;
}

.link-out:hover {
  color: #6366f1;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.info-row .label {
  font-weight: 600;
  color: #333;
  min-width: 72px;
  flex-shrink: 0;
}

.info-row .value {
  color: #666;
}

.info-row .status-good {
  color: #4ade80;
  font-weight: 500;
}

.info-row .status-rebuilt {
  color: #fbbf24;
  font-weight: 500;
}

.info-description {
  margin-top: 8px;
}

.info-description .label {
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.info-description p {
  color: #666;
  line-height: 1.5;
  margin: 0;
  font-size: 0.85rem;
}

.province-buildings {
  padding: 12px;
}

.building-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 8px;
}

.building-item:hover {
  background: #f8f9fa;
  transform: translateX(4px);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  color: #333;
}

.item-meta {
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  color: #667eea;
}

.item-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #999;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stats-panel {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  min-height: 0;
}

.stats-content-wrapper {
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gujian-data-analysis-books {
  margin-top: 0;
  padding-top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.gujian-data-analysis-books__title {
  margin: 0 0 36px;
  font-size: 1.45rem;
  font-weight: 700;
  color: #2a2218;
  font-family: 'STKaiti', 'KaiTi', 'SimSun', serif;
  letter-spacing: 0.06em;
  text-shadow: 0 1px 2px rgba(255, 248, 235, 0.35);
}

.gujian-data-analysis-books :deep(.gujian-data-archive) {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.animation-panel {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.animation-placeholder {
  text-align: center;
}

.animation-header {
  margin-bottom: 40px;
}

.animation-header h2 {
  font-size: 2rem;
  margin-bottom: 12px;
  color: #333;
}

.animation-header p {
  font-size: 1.1rem;
  color: #666;
}

.animation-showcase {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 24px;
  align-items: stretch;
}

.animation-3d-column {
  grid-column: 1;
  min-height: 480px;
  display: flex;
}

.animation-3d-column > * {
  flex: 1;
  min-width: 0;
}

.animation-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.timeline-panel {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  min-height: calc(100vh - 200px);
  max-width: 1200px;
  width: 100%;
}

.timeline-content {
  width: 100%;
}

.timeline-header {
  text-align: center;
  margin-bottom: 80px;
}

.timeline-header h2 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: #333;
}

.timeline-header p {
  font-size: 1.2rem;
  color: #666;
}

.vertical-timeline {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 100px;
  position: relative;
}

.timeline-item.left {
  justify-content: flex-start;
}

.timeline-item.right {
  justify-content: flex-end;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 80px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.marker-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  z-index: 1;
}

.marker-line {
  flex: 1;
  width: 3px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  min-height: 80px;
}

.timeline-item:last-child .marker-line {
  display: none;
}

.timeline-content-wrapper {
  width: calc(50% - 60px);
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.timeline-item.left .timeline-content-wrapper {
  margin-right: 60px;
}

.timeline-item.right .timeline-content-wrapper {
  margin-left: 60px;
}

.period-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.timeline-period {
  font-size: 0.95rem;
  color: #667eea;
  font-weight: 700;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding: 8px 16px;
  border-radius: 20px;
}

.building-count {
  font-size: 0.9rem;
  color: #764ba2;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
  padding: 6px 14px;
  border-radius: 16px;
}

.timeline-title {
  font-size: 1.5rem;
  margin: 0 0 12px 0;
  color: #333;
}

.timeline-description {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.6;
}

.timeline-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.feature-tag {
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  font-size: 0.85rem;
}

.timeline-buildings {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.building-timeline-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #e5e7eb;
  transition: all 0.3s;
}

.building-timeline-item:hover {
  background: #f0f0f0;
  border-left-color: #667eea;
  transform: translateX(4px);
}

.building-timeline-item.classic {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-left-color: #667eea;
  border-left-width: 6px;
}

.building-timeline-item.classic:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-left-color: #764ba2;
}

.building-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.building-star {
  font-size: 1.5rem;
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  animation: star-pulse 2s ease-in-out infinite;
}

@keyframes star-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.building-year {
  font-size: 0.85rem;
  color: #764ba2;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
  padding: 4px 10px;
  border-radius: 12px;
  white-space: nowrap;
}

.building-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.building-timeline-item.classic .building-name {
  color: #667eea;
}

.building-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.building-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.building-timeline-item:hover .building-image img {
  transform: scale(1.05);
}

.game-panel {
  background: transparent;
  border-radius: 0;
  padding: 30px;
  box-shadow: none;
}

.game-panel--luxe {
  padding: 20px 24px 120px;
  box-sizing: border-box;
}

.game-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.game-content--embed-only {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  text-align: left;
  min-width: 0;
}

.game-content--embed-only.game-content--trio {
  max-width: min(100%, 1720px);
}

.game-content--luxe {
  max-width: min(100%, 1680px);
}

.game-luxe-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 22px;
  padding: 0 4px;
}

.game-luxe-head__mark {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #f0d78c 0%, #b8860b 45%, #8b6914 100%);
  transform: rotate(45deg);
  box-shadow:
    0 0 12px rgba(212, 175, 55, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.game-luxe-head__text {
  min-width: 0;
}

.game-luxe-head__title {
  margin: 0;
  font-size: clamp(1.35rem, 2.4vw, 1.75rem);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(255, 252, 245, 0.98);
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'STSong', 'SimSun', serif;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
}

.game-luxe-head__sub {
  margin: 6px 0 0;
  font-size: 0.82rem;
  letter-spacing: 0.18em;
  color: rgba(212, 175, 55, 0.75);
}

.game-card-luxe {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-card-luxe__title {
  margin: 0 0 12px;
  font-size: clamp(0.88rem, 1.35vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-align: center;
  color: rgba(255, 250, 240, 0.95);
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'STKaiti', 'KaiTi', serif;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
}

.game-card-luxe__frame {
  position: relative;
  width: 100%;
  border-radius: 4px;
  padding: 10px 10px 18px;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(38, 32, 28, 0.98) 0%, rgba(18, 15, 12, 0.99) 100%);
  border: 2px solid rgba(200, 165, 75, 0.5);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 248, 220, 0.08),
    inset 0 -20px 50px rgba(0, 0, 0, 0.25),
    0 18px 40px rgba(0, 0, 0, 0.42);
}

.game-card-luxe__knob {
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff8e0 0%, #d4af37 40%, #6b5218 88%);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.45),
    inset 0 -2px 4px rgba(0, 0, 0, 0.25);
  z-index: 4;
  pointer-events: none;
}

.game-card-luxe__corner {
  position: absolute;
  width: 14px;
  height: 14px;
  z-index: 3;
  pointer-events: none;
  border-color: rgba(212, 175, 55, 0.65);
  border-style: solid;
  border-width: 0;
}

.game-card-luxe__corner--tl {
  top: 6px;
  left: 6px;
  border-top-width: 2px;
  border-left-width: 2px;
}

.game-card-luxe__corner--tr {
  top: 6px;
  right: 6px;
  border-top-width: 2px;
  border-right-width: 2px;
}

.game-card-luxe__corner--bl {
  bottom: 28px;
  left: 6px;
  border-bottom-width: 2px;
  border-left-width: 2px;
}

.game-card-luxe__corner--br {
  bottom: 28px;
  right: 6px;
  border-bottom-width: 2px;
  border-right-width: 2px;
}

.game-card-luxe__spotlight {
  position: absolute;
  left: 8%;
  right: 8%;
  top: 18px;
  height: 42%;
  border-radius: 50%;
  background: radial-gradient(
    ellipse 70% 55% at 50% 0%,
    rgba(255, 235, 190, 0.12) 0%,
    transparent 65%
  );
  pointer-events: none;
  z-index: 1;
}

.game-card-luxe__body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  overflow: hidden;
  min-height: 0;
  height: var(--game-trio-screen-h);
  min-height: var(--game-trio-screen-h);
  max-height: var(--game-trio-screen-h);
  background: #12100e;
}

.game-card-luxe__meter {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 8px;
  height: 5px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.45);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 4;
  overflow: hidden;
}

.game-card-luxe__meter-fill {
  display: block;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #8b6914, #e8c547, #f5e6a8);
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  transition: width 0.45s ease;
}

.game-card-luxe__status {
  margin: 10px 0 0;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.72);
}

.game-rules-intro--luxe {
  background: rgba(12, 10, 8, 0.65);
  border: 1px solid rgba(212, 175, 55, 0.22);
  border-radius: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.game-rules-intro--luxe .game-rules-intro__label {
  color: #e8c547;
}

.game-trio-row--luxe {
  --game-trio-screen-h: min(38vh, 400px);
  gap: clamp(12px, 2vw, 22px);
}

.game-trio-row {
  --game-trio-screen-h: min(40vh, 420px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  width: 100%;
  align-items: start;
}

.game-slot {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.game-slot__title {
  flex-shrink: 0;
  margin: 0 0 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 240, 220, 0.96);
  letter-spacing: 0.02em;
}

.game-slot--embed :deep(#game-container.hzh-embed--trio-slot),
.game-slot--embed :deep(.yzm-embed.yzm-embed--trio-slot),
.game-slot--embed :deep(.g2z-embed.g2z-embed--trio-slot),
.game-card-luxe :deep(#game-container.hzh-embed--trio-slot),
.game-card-luxe :deep(.yzm-embed.yzm-embed--trio-slot),
.game-card-luxe :deep(.g2z-embed.g2z-embed--trio-slot) {
  flex: 0 0 auto;
  min-height: 0;
}

.game-slot__panel {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: var(--game-trio-screen-h);
  min-height: var(--game-trio-screen-h);
  max-height: var(--game-trio-screen-h);
  padding: 20px 14px;
  text-align: center;
  border-radius: 14px;
  background: #1e2329;
  box-shadow: 0 12px 40px rgba(15, 18, 28, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-sizing: border-box;
}

.game-slot__hint {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: rgba(232, 220, 200, 0.88);
  font-family: 'STKaiti', 'KaiTi', 'PingFang SC', 'Microsoft YaHei', serif;
}

.game-slot__sub {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: rgba(200, 195, 185, 0.65);
  max-width: 12em;
}

.game-rules-intro {
  margin: 0 0 18px;
  padding: 14px 18px;
  font-size: 0.95rem;
  line-height: 1.65;
  color: rgba(255, 252, 245, 0.95);
  text-align: left;
  background: rgba(20, 24, 32, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.game-rules-intro__label {
  display: inline-block;
  margin-right: 0.35em;
  font-weight: 600;
  color: #ffd9a0;
}

@media (max-width: 960px) {
  .game-trio-row {
    grid-template-columns: 1fr;
  }

  .game-panel--luxe {
    padding: 16px 12px 108px;
  }
}

@media (max-width: 1200px) {
  .map-content {
    grid-template-columns: 1fr;
  }
  
  .map-main {
    grid-template-columns: 1fr;
  }
  
  .building-list {
    max-height: 400px;
  }
  
  .animation-showcase {
    grid-template-columns: 1fr;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .case-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .carousel-header {
    height: 300px;
  }
  
  .slide-content h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .slide-image {
    height: 180px;
  }
  
  .page-tabs {
    gap: 4px;
    padding: 8px 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .page-tabs button {
    min-width: 96px;
    padding: 6px 10px;
    font-size: 0.8rem;
  }
  
  .map-content {
    padding: 20px 10px;
  }
  
  .animation-showcase {
    grid-template-columns: 1fr;
  }

  .animation-3d-column {
    min-height: 400px;
  }

  .map-view--animation-fs {
    --map-tabs-bar-height: 100px;
  }

  .map-view--animation-fs .animation-showcase {
    grid-template-columns: 1fr;
  }

  .damage-stats {
    grid-template-columns: 1fr;
  }
  
  .protection-item {
    flex-direction: column;
    text-align: center;
  }
  
  .timeline-item {
    flex-direction: column;
    gap: 16px;
  }
  
  .timeline-marker {
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }
  
  .marker-line {
    width: 2px;
    min-height: 40px;
  }
  
  .filter-buttons {
    gap: 6px;
  }
  
  .filter-buttons button {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>