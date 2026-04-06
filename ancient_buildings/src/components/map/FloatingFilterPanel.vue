<template>
  <div class="filter-panel-wrapper">
    <button
      v-if="!isPanelOpen"
      class="filter-toggle-btn"
      @click="isPanelOpen = true"
      title="打开筛选条件"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
      </svg>
      <span>筛选</span>
    </button>

    <transition name="slide-in">
      <div v-if="isPanelOpen" class="filter-panel">
        <div class="panel-header">
          <h3>筛选条件</h3>
          <button class="close-btn" @click="isPanelOpen = false">×</button>
        </div>

        <div class="filter-section">
          <div class="filter-label">省份</div>
          <div class="filter-buttons">
            <button
              v-for="prov in provinces"
              :key="prov"
              class="filter-btn province-btn"
              :class="{ active: filters.province === prov }"
              @click="updateFilter('province', prov)"
            >
              {{ prov }}
            </button>
            <button
              class="filter-btn province-btn"
              :class="{ active: !filters.province }"
              @click="updateFilter('province', '')"
            >
              全部
            </button>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-label-row">
            <div class="filter-label">朝代</div>
            <button v-if="filters.dynasty" class="clear-mini-btn" @click="updateFilter('dynasty', '')">
              清除
            </button>
          </div>

          <div class="dynasty-groups">
            <div class="dynasty-group">
              <div class="group-title">主要朝代</div>
              <div class="filter-buttons">
                <button
                  v-for="dyn in mainDynasties"
                  :key="`main-${dyn}`"
                  class="filter-btn dynasty-filter-btn"
                  :class="{ active: filters.dynasty === dyn }"
                  :style="getDynastyButtonStyle(dyn)"
                  @click="toggleDynasty(dyn)"
                >
                  {{ dyn }}
                </button>
              </div>
            </div>

            <div class="dynasty-group" v-if="secondaryDynasties.length">
              <div class="group-title">次要朝代</div>
              <div class="filter-buttons">
                <button
                  v-for="dyn in secondaryDynasties"
                  :key="`sub-${dyn}`"
                  class="filter-btn dynasty-filter-btn"
                  :class="{ active: filters.dynasty === dyn }"
                  :style="getDynastyButtonStyle(dyn)"
                  @click="toggleDynasty(dyn)"
                >
                  {{ dyn }}
                </button>
              </div>
            </div>

            <div class="dynasty-group" v-if="otherDynasties.length">
              <div class="group-title">其他朝代</div>
              <div class="filter-buttons">
                <button
                  v-for="dyn in otherDynasties"
                  :key="`other-${dyn}`"
                  class="filter-btn dynasty-filter-btn"
                  :class="{ active: filters.dynasty === dyn }"
                  :style="getDynastyButtonStyle(dyn)"
                  @click="toggleDynasty(dyn)"
                >
                  {{ dyn }}
                </button>
              </div>
            </div>

            <div class="filter-buttons">
              <button class="filter-btn" :class="{ active: !filters.dynasty }" @click="updateFilter('dynasty', '')">
                全部
              </button>
            </div>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-label">遗产状态</div>
          <div class="filter-buttons">
            <button
              v-for="stat in statuses"
              :key="stat"
              class="filter-btn"
              :class="{ active: filters.status === stat }"
              @click="updateFilter('status', stat)"
            >
              {{ stat }}
            </button>
            <button
              class="filter-btn"
              :class="{ active: !filters.status }"
              @click="updateFilter('status', '')"
            >
              全部
            </button>
          </div>
        </div>

        <div class="panel-footer">
          <button class="reset-btn" @click="resetFilters">重置</button>
          <button class="apply-btn" @click="isPanelOpen = false">完成</button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="isPanelOpen" class="filter-overlay" @click="isPanelOpen = false" />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { normalizeProvinceName } from '../../utils/provinceUtils.js'

const props = defineProps({
  filters: { type: Object, default: () => ({}) },
  buildings: { type: Array, default: () => [] }
})

const emit = defineEmits(['update-filters'])
const isPanelOpen = ref(false)

const normalizeDynastyName = (input) => {
  if (!input) return ''
  let raw = String(input).trim()
  if (!raw) return ''

  // 不明确/占位值直接忽略
  if (/(未知|不详|待考|约|暂缺|其它|其他|无|现代|当代|史前|夏商周|先秦两汉)/.test(raw)) return ''
  // 多朝代混写视为不明确
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

const provinces = computed(() => {
  const set = new Set()
  props.buildings.forEach((b) => {
    const p = normalizeProvinceName(b.province)
    if (p) set.add(p)
  })
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
})

const dynasties = computed(() => {
  const set = new Set()
  props.buildings.forEach((b) => {
    const normalized = normalizeDynastyName(b.dynasty)
    if (normalized) set.add(normalized)
  })
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
})

const mainDynastyPreset = ['秦', '汉', '唐', '宋', '元', '明', '清', '民国']
const secondaryDynastyPreset = ['隋', '辽', '金', '五代', '南北朝']

const mainDynasties = computed(() =>
  mainDynastyPreset.filter((d) => dynasties.value.includes(d))
)

const secondaryDynasties = computed(() =>
  secondaryDynastyPreset.filter((d) => dynasties.value.includes(d) && !mainDynasties.value.includes(d))
)

const otherDynasties = computed(() =>
  dynasties.value.filter((d) => !mainDynasties.value.includes(d) && !secondaryDynasties.value.includes(d))
)

const statuses = computed(() => {
  const set = new Set()
  props.buildings.forEach((b) => {
    if (b.status) set.add(b.status)
  })
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
})

const updateFilter = (key, value) => {
  emit('update-filters', { ...props.filters, [key]: value })
}

const toggleDynasty = (dynasty) => {
  if (props.filters.dynasty === dynasty) {
    updateFilter('dynasty', '')
    return
  }
  updateFilter('dynasty', dynasty)
}

const getDynastyColor = (dynasty) => {
  const map = {
    秦: '#A78BFA',
    汉: '#F59E0B',
    唐: '#EF4444',
    宋: '#22C55E',
    元: '#06B6D4',
    明: '#3B82F6',
    清: '#F97316',
    民国: '#9CA3AF'
  }
  return map[dynasty] || '#36cbcb'
}

const getDynastyButtonStyle = (dynasty) => {
  const color = getDynastyColor(dynasty)
  const active = props.filters.dynasty === dynasty
  return {
    borderColor: color,
    backgroundColor: active ? `${color}26` : 'transparent',
    color: active ? color : 'rgba(255, 255, 255, 0.75)'
  }
}

const resetFilters = () => {
  emit('update-filters', { dynasty: '', province: '', status: '' })
}
</script>

<style scoped>
.filter-panel-wrapper {
  position: relative;
  z-index: 1000;
}

.filter-toggle-btn {
  position: fixed;
  top: 148px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(10, 10, 30, 0.9);
  border: 1px solid rgba(54, 203, 203, 0.3);
  border-radius: 8px;
  color: #36cbcb;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  z-index: 101;
  transition: all 0.3s ease;
}

.filter-toggle-btn:hover {
  background: rgba(54, 203, 203, 0.2);
  border-color: #36cbcb;
}

.filter-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.filter-panel {
  position: fixed;
  left: 24px;
  top: 206px;
  width: 320px;
  max-height: 70vh;
  background: rgba(10, 10, 30, 0.95);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(54, 203, 203, 0.3);
  border-radius: 14px;
  overflow-y: auto;
  z-index: 102;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(54, 203, 203, 0.2);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #36cbcb;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
}

.close-btn:hover {
  color: #36cbcb;
}

.filter-section {
  padding: 16px;
  border-bottom: 1px solid rgba(54, 203, 203, 0.1);
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
  letter-spacing: 0.05em;
}

.filter-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.filter-label-row .filter-label {
  margin-bottom: 0;
}

.clear-mini-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  border-radius: 999px;
  padding: 2px 10px;
  cursor: pointer;
}

.clear-mini-btn:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}

.dynasty-groups {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dynasty-group {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.group-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 8px;
}

.dynasty-filter-btn {
  transition: all 0.2s ease;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-btn {
  padding: 6px 12px;
  background: rgba(54, 203, 203, 0.1);
  border: 1px solid rgba(54, 203, 203, 0.3);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  cursor: pointer;
}

.filter-btn:hover {
  border-color: #36cbcb;
  color: #36cbcb;
}

.filter-btn.active {
  background: rgba(54, 203, 203, 0.2);
  border-color: #36cbcb;
  color: #36cbcb;
}

.province-btn {
  padding: 8px 12px;
  background: rgba(54, 203, 203, 0.08);
  border: 1px solid rgba(54, 203, 203, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.province-btn:hover {
  background: rgba(54, 203, 203, 0.15);
  border-color: #36CBCB;
  color: #36CBCB;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(54, 203, 203, 0.4),
              0 0 16px rgba(54, 203, 203, 0.3);
}

.province-btn.active {
  background: rgba(54, 203, 203, 0.25);
  border-color: #36CBCB;
  color: #36CBCB;
  box-shadow: 0 0 12px rgba(54, 203, 203, 0.4);
}

.panel-footer {
  display: flex;
  gap: 10px;
  padding: 16px;
  border-top: 1px solid rgba(54, 203, 203, 0.2);
}

.reset-btn,
.apply-btn {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.reset-btn {
  background: rgba(54, 203, 203, 0.1);
  color: #36cbcb;
  border: 1px solid rgba(54, 203, 203, 0.3);
}

.apply-btn {
  background: linear-gradient(135deg, #36cbcb, #22d3ee);
  color: #000;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
