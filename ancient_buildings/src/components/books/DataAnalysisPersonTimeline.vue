<template>
  <div class="gujian-person-timeline" aria-label="栋宇良工人物时间线">
    <p v-if="loadError" class="gujian-person-timeline__err">{{ loadError }}</p>
    <div v-else-if="!sortedPersons.length" class="gujian-person-timeline__empty">
      暂无人物数据，请在「数据分析」目录准备 person.xlsx 并运行 python build_database.py
    </div>
    <Transition v-else name="gujian-person-unfurl">
      <div class="gujian-person-timeline__shell" key="person-scroll">
        <div class="gujian-person-timeline__roller gujian-person-timeline__roller--left" aria-hidden="true">
          <span class="gujian-person-timeline__roller-cap" />
          <span class="gujian-person-timeline__roller-shaft" />
        </div>
        <div class="gujian-person-timeline__paper">
          <span class="gujian-person-timeline__corner gujian-person-timeline__corner--tl" aria-hidden="true" />
          <span class="gujian-person-timeline__corner gujian-person-timeline__corner--tr" aria-hidden="true" />
          <span class="gujian-person-timeline__corner gujian-person-timeline__corner--bl" aria-hidden="true" />
          <span class="gujian-person-timeline__corner gujian-person-timeline__corner--br" aria-hidden="true" />
          <div class="gujian-person-timeline__seal-mark" aria-hidden="true" />
          <div class="gujian-person-timeline__cloud gujian-person-timeline__cloud--left" aria-hidden="true" />
          <div class="gujian-person-timeline__cloud gujian-person-timeline__cloud--right" aria-hidden="true" />
          <div class="gujian-person-timeline__texture" aria-hidden="true" />
          <div class="gujian-person-timeline__rules" aria-hidden="true" />
          <div class="gujian-person-timeline__track-scroll">
            <div
              class="gujian-person-timeline__track"
              :style="{ minWidth: trackMinWidth }"
            >
              <div class="gujian-person-timeline__axis" aria-hidden="true">
                <svg
                  class="gujian-person-timeline__axis-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1200 64"
                  preserveAspectRatio="none"
                  focusable="false"
                >
                  <defs>
                    <linearGradient :id="huangheFillId" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#fff6e4" stop-opacity="0.55" />
                      <stop offset="18%" stop-color="#e8bc52" stop-opacity="1" />
                      <stop offset="42%" stop-color="#f0d070" stop-opacity="1" />
                      <stop offset="58%" stop-color="#c99430" stop-opacity="1" />
                      <stop offset="82%" stop-color="#7a4a18" stop-opacity="1" />
                      <stop offset="100%" stop-color="#1e1006" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient :id="huangheShoreId" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#5c3010" stop-opacity="0.5" />
                      <stop offset="8%" stop-color="transparent" stop-opacity="0" />
                      <stop offset="92%" stop-color="transparent" stop-opacity="0" />
                      <stop offset="100%" stop-color="#5c3010" stop-opacity="0.5" />
                    </linearGradient>
                    <linearGradient :id="huangheRushId" x1="-20%" y1="50%" x2="120%" y2="50%">
                      <stop offset="0%" stop-color="transparent" />
                      <stop offset="35%" stop-color="rgba(255,250,235,0.14)" />
                      <stop offset="50%" stop-color="rgba(255,255,255,0.22)" />
                      <stop offset="65%" stop-color="rgba(255,250,235,0.12)" />
                      <stop offset="100%" stop-color="transparent" />
                    </linearGradient>
                  </defs>
                  <!-- 大弯曲流带：上下岸错位，河宽随弯缩张，似夺溜奔涌 -->
                  <path
                    class="gujian-person-timeline__axis-river"
                    :fill="`url(#${huangheFillId})`"
                    d="M0,22 C95,6 205,8 310,20 C385,28 455,4 540,14 C615,22 695,3 785,16 C865,28 945,6 1035,18 C1105,26 1165,10 1200,20 L1200,48 C1155,58 1095,50 1035,46 C955,40 885,56 800,48 C715,40 645,58 555,50 C465,42 395,56 305,48 C215,40 145,54 70,46 C35,42 12,46 0,44 Z"
                  />
                  <path
                    class="gujian-person-timeline__axis-shore"
                    :fill="`url(#${huangheShoreId})`"
                    d="M0,22 C95,6 205,8 310,20 C385,28 455,4 540,14 C615,22 695,3 785,16 C865,28 945,6 1035,18 C1105,26 1165,10 1200,20 L1200,48 C1155,58 1095,50 1035,46 C955,40 885,56 800,48 C715,40 645,58 555,50 C465,42 395,56 305,48 C215,40 145,54 70,46 C35,42 12,46 0,44 Z"
                    style="mix-blend-mode: multiply"
                  />
                  <!-- 斜向急流高光（随动画平移） -->
                  <path
                    class="gujian-person-timeline__axis-rush"
                    :fill="`url(#${huangheRushId})`"
                    d="M0,22 C95,6 205,8 310,20 C385,28 455,4 540,14 C615,22 695,3 785,16 C865,28 945,6 1035,18 C1105,26 1165,10 1200,20 L1200,48 C1155,58 1095,50 1035,46 C955,40 885,56 800,48 C715,40 645,58 555,50 C465,42 395,56 305,48 C215,40 145,54 70,46 C35,42 12,46 0,44 Z"
                    style="mix-blend-mode: soft-light"
                  />
                  <path
                    class="gujian-person-timeline__axis-outline"
                    fill="none"
                    stroke="rgba(90, 48, 18, 0.58)"
                    stroke-width="0.85"
                    vector-effect="non-scaling-stroke"
                    d="M0,22 C95,6 205,8 310,20 C385,28 455,4 540,14 C615,22 695,3 785,16 C865,28 945,6 1035,18 C1105,26 1165,10 1200,20 L1200,48 C1155,58 1095,50 1035,46 C955,40 885,56 800,48 C715,40 645,58 555,50 C465,42 395,56 305,48 C215,40 145,54 70,46 C35,42 12,46 0,44 Z"
                  />
                  <!-- 中流：大起伏 + 虚线奔流 -->
                  <path
                    class="gujian-person-timeline__axis-midflow"
                    fill="none"
                    stroke="rgba(255, 238, 200, 0.42)"
                    stroke-width="0.75"
                    stroke-linecap="round"
                    vector-effect="non-scaling-stroke"
                    d="M0,34 C140,14 220,48 380,28 C480,14 560,46 720,30 C840,18 920,44 1080,26 C1140,20 1180,32 1200,34"
                  />
                  <path
                    class="gujian-person-timeline__axis-midflow2"
                    fill="none"
                    stroke="rgba(180, 120, 48, 0.35)"
                    stroke-width="0.55"
                    stroke-linecap="round"
                    vector-effect="non-scaling-stroke"
                    d="M0,38 C160,52 280,22 420,40 C540,22 660,50 800,34 C920,22 1020,46 1200,36"
                  />
                  <!-- 表层浪涌线（两组错位平移） -->
                  <g
                    class="gujian-person-timeline__axis-surge-a"
                    fill="none"
                    stroke="rgba(255, 250, 235, 0.38)"
                    stroke-width="0.5"
                    stroke-linecap="round"
                    vector-effect="non-scaling-stroke"
                  >
                    <path
                      d="M-40,26 C80,18 200,34 320,24 S560,20 680,28 S920,22 1040,30 S1240,24 1320,28"
                    />
                    <path
                      d="M-40,32 C100,40 220,24 360,34 S580,38 760,28 S980,36 1160,30 S1280,34 1340,32"
                    />
                  </g>
                  <g
                    class="gujian-person-timeline__axis-surge-b"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.22)"
                    stroke-width="0.45"
                    stroke-linecap="round"
                    vector-effect="non-scaling-stroke"
                  >
                    <path
                      d="M-80,29 C60,22 180,36 300,26 S520,24 660,30 S860,26 1000,32 S1180,28 1280,31"
                    />
                  </g>
                </svg>
              </div>
              <div
                v-for="(person, i) in sortedPersons"
                :key="personKey(person, i)"
                class="gujian-person-timeline__mark"
                :class="{ 'gujian-person-timeline__mark--above': i % 2 === 0 }"
                :style="{ left: markLeft(i, sortedPersons.length) }"
              >
                <template v-if="i % 2 === 0">
                  <button
                    type="button"
                    class="gujian-person-timeline__name"
                    :style="{ animationDelay: `${i * 0.16}s` }"
                    :aria-label="`查看 ${displayName(person)} 详情`"
                    @click="openPerson(person)"
                  >
                    {{ displayName(person) }}
                  </button>
                  <span class="gujian-person-timeline__stem gujian-person-timeline__stem--down" aria-hidden="true" />
                  <span class="gujian-person-timeline__dot" aria-hidden="true" />
                </template>
                <template v-else>
                  <span class="gujian-person-timeline__dot" aria-hidden="true" />
                  <span class="gujian-person-timeline__stem gujian-person-timeline__stem--down" aria-hidden="true" />
                  <button
                    type="button"
                    class="gujian-person-timeline__name"
                    :style="{ animationDelay: `${i * 0.16}s` }"
                    :aria-label="`查看 ${displayName(person)} 详情`"
                    @click="openPerson(person)"
                  >
                    {{ displayName(person) }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="gujian-person-timeline__roller gujian-person-timeline__roller--right" aria-hidden="true">
          <span class="gujian-person-timeline__roller-shaft" />
          <span class="gujian-person-timeline__roller-cap" />
        </div>
      </div>
    </Transition>

    <Teleport to="body">
      <Transition name="gujian-person-modal" @after-enter="onPersonModalAfterEnter">
        <div
          v-if="activePerson"
          :key="personModalDialogKey"
          class="gujian-person-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="modalTitleId"
        >
          <div class="gujian-person-modal__backdrop" @click="closePerson" />
          <div
            class="gujian-person-modal__panel"
            :class="{ 'gujian-person-modal__panel--stagger': personModalStagger }"
            @click.stop
          >
            <button type="button" class="gujian-person-modal__close" aria-label="关闭" @click="closePerson">×</button>
            <div class="gujian-person-modal__layout">
              <div class="gujian-person-modal__col gujian-person-modal__col--media">
                <div class="gujian-person-modal__box gujian-person-modal__box--media">
                  <div class="gujian-person-modal__media">
                    <img
                      v-if="displayPortraitUrl && !portraitExhausted"
                      :key="portraitIndex"
                      :src="displayPortraitUrl"
                      :alt="displayName(activePerson)"
                      class="gujian-person-modal__img"
                      loading="lazy"
                      @error="onPortraitImgError"
                    />
                    <div v-else class="gujian-person-modal__img-placeholder">像</div>
                  </div>
                </div>
              </div>
              <div class="gujian-person-modal__col gujian-person-modal__col--body">
                <div class="gujian-person-modal__box gujian-person-modal__box--body">
                  <h2
                    :id="modalTitleId"
                    class="gujian-person-modal__title gujian-person-modal__text-reveal"
                    :style="{ '--row-i': 0 }"
                  >
                    {{ displayName(activePerson) }}
                  </h2>
                  <template v-for="(item, idx) in personDetailFields" :key="item.key">
                    <dl
                      class="gujian-person-modal__dl gujian-person-modal__dl--row gujian-person-modal__text-reveal"
                      :style="{ '--row-i': idx + 1 }"
                    >
                      <dt class="gujian-person-modal__dt">{{ item.label }}</dt>
                      <dd class="gujian-person-modal__dd">{{ item.value }}</dd>
                    </dl>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, useId, nextTick } from 'vue'

/** SVG 渐变 id（避免同页多实例冲突） */
const _ptId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const huangheFillId = `gujian-huanghe-fill-${_ptId}`
const huangheShoreId = `gujian-huanghe-shore-${_ptId}`
const huangheRushId = `gujian-huanghe-rush-${_ptId}`

const props = defineProps({
  persons: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  loadError: { type: String, default: '' },
})

/** 朝代大致先后（同序内再按姓名排序）；未收录的朝代排在后面 */
const DYNASTY_ORDER = [
  '史前',
  '夏',
  '商',
  '周',
  '春秋',
  '春秋末期',
  '战国',
  '秦',
  '西汉',
  '新',
  '东汉',
  '三国',
  '魏',
  '蜀汉',
  '吴',
  '西晋',
  '东晋',
  '十六国',
  '南北朝',
  '南朝',
  '北朝',
  '隋',
  '唐',
  '武周',
  '五代',
  '十国',
  '辽',
  '北宋',
  '南宋',
  '金',
  '元',
  '明',
  '清',
  '民国',
  '近现代',
  '当代',
  '现代',
]

const IMAGE_KEYS = new Set(['图片', '图片参考', '头像', '照片', 'image', 'photo', 'img'])

const activePerson = ref(null)
/** 面板入场后再触发展示，避免依赖 enter-active（会被根过渡过早摘掉） */
const personModalStagger = ref(false)
const modalTitleId = 'gujian-person-modal-title'
const portraitCandidates = ref([])
const portraitIndex = ref(0)
const portraitExhausted = ref(false)

const minPxPerMark = 88

const trackMinWidth = computed(() => {
  const n = sortedPersons.value.length
  if (n <= 0) return '100%'
  return `max(100%, ${n * minPxPerMark}px)`
})

function dynastyRank(dynasty) {
  const t = String(dynasty ?? '').trim()
  if (!t) return 998
  let idx = DYNASTY_ORDER.indexOf(t)
  if (idx >= 0) return idx
  for (let i = 0; i < DYNASTY_ORDER.length; i++) {
    const d = DYNASTY_ORDER[i]
    if (t.includes(d) || d.includes(t)) return i
  }
  return 997
}

function displayName(row) {
  if (!row || typeof row !== 'object') return '未命名'
  const v = row['姓名'] ?? row['名'] ?? row[props.columns[0] ?? '']
  const s = v == null ? '' : String(v).trim()
  return s || '未命名'
}

function dynastyOf(row) {
  return row['朝代'] ?? row['时代'] ?? ''
}

const sortedPersons = computed(() => {
  const list = Array.isArray(props.persons) ? [...props.persons] : []
  list.sort((a, b) => {
    const ra = dynastyRank(dynastyOf(a))
    const rb = dynastyRank(dynastyOf(b))
    if (ra !== rb) return ra - rb
    return displayName(a).localeCompare(displayName(b), 'zh-Hans-CN')
  })
  return list
})

function personKey(row, i) {
  return `${displayName(row)}-${i}`
}

function markLeft(i, n) {
  if (n <= 1) return '50%'
  return `${((i + 1) / (n + 1)) * 100}%`
}

function firstPortraitRaw(row) {
  if (!row) return ''
  for (const k of Object.keys(row)) {
    if (IMAGE_KEYS.has(k)) {
      const s = String(row[k] ?? '').trim()
      if (s) return s
    }
  }
  return ''
}

const personModalDialogKey = computed(() => {
  const p = activePerson.value
  if (!p) return ''
  return `${displayName(p)}|${dynastyOf(p)}|${firstPortraitRaw(p)}`
})

function basenameFromPortraitPath(s) {
  return s.replace(/\\/g, '/').split('/').filter(Boolean).pop() || ''
}

/** 优先 /images/（数据分析/images 同步至 public/images），再试旧路径 /images/images/ 与 Excel 原路径 */
function buildPortraitCandidates(row) {
  const raw = firstPortraitRaw(row)
  const out = []
  const shortName = displayName(row).split('（')[0].trim()

  if (raw && /^https?:\/\//i.test(raw)) {
    return [raw]
  }

  const base = basenameFromPortraitPath(raw)
  if (base) {
    out.push(`/images/${base}`)
    out.push(`/images/images/${base}`)
    const cleaned = raw.replace(/^\.\//, '')
    if (cleaned.startsWith('/')) out.push(cleaned)
    else if (cleaned) out.push(`/${cleaned}`)
  }

  if (shortName) {
    for (const ext of ['.jpg', '.jpeg', '.png', '.webp', '.gif']) {
      out.push(`/images/${shortName}${ext}`)
      out.push(`/images/images/${shortName}${ext}`)
    }
  }

  return [...new Set(out.filter(Boolean))]
}

function openPerson(row) {
  personModalStagger.value = false
  activePerson.value = row
  portraitIndex.value = 0
  portraitExhausted.value = false
  portraitCandidates.value = buildPortraitCandidates(row)
}

function closePerson() {
  personModalStagger.value = false
  activePerson.value = null
  portraitCandidates.value = []
  portraitExhausted.value = false
}

function onPersonModalAfterEnter() {
  personModalStagger.value = false
  nextTick(() => {
    requestAnimationFrame(() => {
      personModalStagger.value = true
    })
  })
}

function onPortraitImgError() {
  if (portraitIndex.value < portraitCandidates.value.length - 1) {
    portraitIndex.value += 1
  } else {
    portraitExhausted.value = true
  }
}

const displayPortraitUrl = computed(() => {
  if (portraitExhausted.value || !portraitCandidates.value.length) return ''
  return portraitCandidates.value[portraitIndex.value] || ''
})

const personDetailFields = computed(() => {
  const row = activePerson.value
  if (!row) return []
  const cols = props.columns.length ? props.columns : Object.keys(row)
  const out = []
  for (const key of cols) {
    if (key === 'id' || IMAGE_KEYS.has(key)) continue
    const raw = row[key]
    const s = raw == null ? '' : String(raw).trim()
    if (!s) continue
    out.push({ key, label: key, value: s })
  }
  return out
})
</script>

<style scoped>
.gujian-person-timeline {
  --pt-ink: #1c1410;
  --pt-ink-soft: #3d3028;
  --pt-brown: #5c3d28;
  --pt-cinnabar: #8b3a32;
  --pt-gold: #b8975c;
  --pt-gold-hi: #d4bc7a;
  --pt-paper: #efe4cc;
  --pt-paper-mid: #e8d9bc;
  --pt-paper-dark: #dcc9a8;
  --pt-line: #2a1e18;
  --pt-jade: #5a7a62;
  --pt-wood: #3d2816;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  font-family: 'STKaiti', 'KaiTi', 'FangSong', 'SimSun', 'Microsoft YaHei', serif;
  color: var(--pt-ink);
}

.gujian-person-timeline__err,
.gujian-person-timeline__empty {
  margin: 0;
  padding: 16px;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--da-brown, #5c4033);
}

.gujian-person-timeline__shell {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  gap: 0;
  /* 整幅横卷外缘：仿古装池 — 深色绫地 + 外鎏金边 + 内赭框 + 画心留白 */
  padding: clamp(10px, 2vw, 14px) clamp(12px, 2.2vw, 18px);
  box-sizing: border-box;
  border-radius: 3px;
  background:
    linear-gradient(180deg, rgba(255, 252, 245, 0.07) 0%, transparent 42%, transparent 58%, rgba(0, 0, 0, 0.12) 100%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, 0.04) 1px,
      rgba(0, 0, 0, 0.04) 2px
    ),
    linear-gradient(125deg, #4a3220 0%, #2e1e14 35%, #241810 70%, #1a120c 100%);
  box-shadow:
    0 0 0 1px rgba(232, 200, 120, 0.55),
    0 0 0 3px #1c120c,
    0 0 0 4px rgba(184, 140, 72, 0.5),
    0 0 0 6px rgba(42, 28, 18, 0.95),
    0 0 0 7px rgba(212, 175, 90, 0.28),
    inset 0 1px 0 rgba(255, 248, 228, 0.1),
    inset 0 -8px 28px rgba(0, 0, 0, 0.28);
  filter: drop-shadow(8px 14px 24px rgba(28, 18, 12, 0.32))
    drop-shadow(0 0 36px rgba(184, 151, 92, 0.08));
  will-change: clip-path;
}

/* 内界方框金线（仿画心外「命纸」边） */
.gujian-person-timeline__shell::before {
  content: '';
  position: absolute;
  z-index: 0;
  inset: clamp(8px, 1.6vw, 12px);
  border-radius: 2px;
  pointer-events: none;
  border: 1px solid rgba(201, 162, 88, 0.38);
  box-shadow:
    inset 0 0 0 1px rgba(26, 18, 12, 0.45),
    0 0 12px rgba(0, 0, 0, 0.15);
}

.gujian-person-timeline__shell > * {
  position: relative;
  z-index: 1;
}

.gujian-person-timeline__roller {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex-shrink: 0;
  width: 22px;
}

.gujian-person-timeline__roller--left {
  justify-content: flex-end;
}

.gujian-person-timeline__roller--right {
  justify-content: flex-start;
}

.gujian-person-timeline__roller-shaft {
  width: 13px;
  align-self: stretch;
  min-height: 200px;
  background:
    repeating-linear-gradient(
      88deg,
      transparent 0px,
      transparent 3px,
      rgba(0, 0, 0, 0.04) 3px,
      rgba(0, 0, 0, 0.04) 4px
    ),
    linear-gradient(90deg, #120c08 0%, var(--pt-wood) 28%, #6b4a32 48%, var(--pt-wood) 72%, #0f0a06 100%);
  box-shadow:
    inset 3px 0 8px rgba(0, 0, 0, 0.5),
    inset -1px 0 4px rgba(255, 248, 235, 0.06);
}

.gujian-person-timeline__roller--left .gujian-person-timeline__roller-shaft {
  border-radius: 6px 0 0 6px;
  box-shadow:
    inset 3px 0 8px rgba(0, 0, 0, 0.5),
    inset -1px 0 4px rgba(255, 248, 235, 0.06),
    -1px 0 0 rgba(201, 162, 88, 0.22);
}

.gujian-person-timeline__roller--right .gujian-person-timeline__roller-shaft {
  border-radius: 0 6px 6px 0;
  box-shadow:
    inset 3px 0 8px rgba(0, 0, 0, 0.5),
    inset -1px 0 4px rgba(255, 248, 235, 0.06),
    1px 0 0 rgba(201, 162, 88, 0.22);
}

.gujian-person-timeline__roller-cap {
  width: 19px;
  align-self: center;
  min-height: 72%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 28%, rgba(255, 255, 255, 0.38), transparent 42%),
    radial-gradient(circle at 50% 100%, rgba(0, 0, 0, 0.28), transparent 52%),
    linear-gradient(155deg, #8fb89a 0%, var(--pt-jade) 38%, #3d5a44 88%, #243828 100%);
  box-shadow:
    inset 0 -4px 8px rgba(0, 0, 0, 0.35),
    inset 0 2px 5px rgba(255, 255, 255, 0.22),
    2px 4px 12px rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(30, 48, 36, 0.35);
}

.gujian-person-timeline__paper {
  position: relative;
  flex: 1;
  min-width: 0;
  max-width: min(96vw, 980px);
  background:
    radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255, 252, 240, 0.55) 0%, transparent 55%),
    linear-gradient(
      180deg,
      #faf6ea 0%,
      var(--pt-paper) 32%,
      var(--pt-paper-mid) 58%,
      var(--pt-paper-dark) 100%
    );
  border: none;
  /* 画心「命纸」双边：与外层装池呼应 */
  box-shadow:
    inset 0 0 0 1px rgba(62, 42, 26, 0.45),
    inset 0 0 0 2px rgba(255, 252, 245, 0.88),
    inset 0 0 0 3px rgba(184, 140, 72, 0.48),
    inset 0 0 0 5px rgba(252, 248, 238, 0.65),
    inset 0 0 0 6px rgba(72, 48, 28, 0.18),
    inset 0 0 0 7px rgba(212, 175, 90, 0.12);
}

/* 四角拐子纹式托角（双线 + 端点小勾，略似回纹一角） */
.gujian-person-timeline__corner {
  position: absolute;
  width: 26px;
  height: 26px;
  z-index: 3;
  pointer-events: none;
  border-style: solid;
  border-color: #4a2814;
  opacity: 0.92;
  box-sizing: border-box;
}

.gujian-person-timeline__corner::before {
  content: '';
  position: absolute;
  border-style: solid;
  border-color: rgba(201, 162, 88, 0.75);
  box-sizing: border-box;
  pointer-events: none;
}

.gujian-person-timeline__corner--tl {
  top: 8px;
  left: 8px;
  border-width: 2px 0 0 2px;
  box-shadow: -1px -1px 0 rgba(255, 248, 228, 0.35);
}

.gujian-person-timeline__corner--tl::before {
  top: 3px;
  left: 3px;
  width: 11px;
  height: 11px;
  border-width: 1px 0 0 1px;
}

.gujian-person-timeline__corner--tr {
  top: 8px;
  right: 8px;
  border-width: 2px 2px 0 0;
  box-shadow: 1px -1px 0 rgba(255, 248, 228, 0.35);
}

.gujian-person-timeline__corner--tr::before {
  top: 3px;
  right: 3px;
  width: 11px;
  height: 11px;
  border-width: 1px 1px 0 0;
}

.gujian-person-timeline__corner--bl {
  bottom: 8px;
  left: 8px;
  border-width: 0 0 2px 2px;
  box-shadow: -1px 1px 0 rgba(255, 248, 228, 0.35);
}

.gujian-person-timeline__corner--bl::before {
  bottom: 3px;
  left: 3px;
  width: 11px;
  height: 11px;
  border-width: 0 0 1px 1px;
}

.gujian-person-timeline__corner--br {
  bottom: 8px;
  right: 8px;
  border-width: 0 2px 2px 0;
  box-shadow: 1px 1px 0 rgba(255, 248, 228, 0.35);
}

.gujian-person-timeline__corner--br::before {
  bottom: 3px;
  right: 3px;
  width: 11px;
  height: 11px;
  border-width: 0 1px 1px 0;
}

/* 闲章淡影 */
.gujian-person-timeline__seal-mark {
  position: absolute;
  right: clamp(14px, 3vw, 28px);
  bottom: clamp(12px, 2.5vw, 24px);
  width: 48px;
  height: 48px;
  z-index: 2;
  pointer-events: none;
  border: 2px solid rgba(160, 48, 42, 0.12);
  border-radius: 3px;
  transform: rotate(-14deg);
  background: radial-gradient(circle at 40% 35%, rgba(180, 60, 52, 0.08), transparent 62%);
}

.gujian-person-timeline__texture {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.11;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

/* 竖格淡线（仿笺纸） */
.gujian-person-timeline__rules {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.14;
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 39px,
    rgba(139, 105, 72, 0.2) 39px,
    rgba(139, 105, 72, 0.2) 40px
  );
  mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
}

.gujian-person-timeline__cloud {
  position: absolute;
  top: 50%;
  width: clamp(52px, 13vw, 108px);
  height: 150%;
  transform: translateY(-50%);
  background:
    radial-gradient(ellipse 70% 45% at 40% 45%, rgba(255, 250, 235, 0.5), transparent 68%),
    radial-gradient(ellipse 55% 40% at 65% 55%, rgba(212, 188, 122, 0.12), transparent 65%);
  opacity: 0.72;
  pointer-events: none;
}

.gujian-person-timeline__cloud--left {
  left: 0;
  transform: translate(-35%, -50%);
}

.gujian-person-timeline__cloud--right {
  right: 0;
  transform: translate(35%, -50%);
}

.gujian-person-timeline__track-scroll {
  position: relative;
  z-index: 1;
  overflow-x: auto;
  overflow-y: hidden;
  /* 内界栏：仿笺纸上下栏线 */
  padding: clamp(28px, 5vw, 44px) clamp(36px, 6vw, 56px);
  margin: 2px 3px;
  border-top: 1px solid rgba(92, 58, 36, 0.14);
  border-bottom: 1px solid rgba(92, 58, 36, 0.14);
  box-shadow:
    inset 0 10px 14px -12px rgba(255, 252, 245, 0.75),
    inset 0 -10px 14px -12px rgba(62, 42, 26, 0.06);
  -webkit-overflow-scrolling: touch;
}

.gujian-person-timeline__track-scroll::-webkit-scrollbar {
  height: 8px;
}

.gujian-person-timeline__track-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(184, 151, 92, 0.45), rgba(92, 61, 40, 0.5));
  border-radius: 999px;
  border: 1px solid rgba(255, 248, 235, 0.25);
}

.gujian-person-timeline__track {
  position: relative;
  height: clamp(200px, 28vh, 280px);
}

/* 时间中轴：黄河大弯 + 浪涌平移 + 中流虚线 + 急流高光 */
.gujian-person-timeline__axis {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  height: clamp(38px, 7.5vw, 56px);
  overflow: visible;
  pointer-events: none;
  background: transparent;
  isolation: isolate;
  mask-image: linear-gradient(90deg, transparent 0%, black 1.5%, black 98.5%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 1.5%, black 98.5%, transparent 100%);
}

.gujian-person-timeline__axis-svg {
  position: relative;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 1px 0 rgba(255, 248, 228, 0.55)) drop-shadow(0 8px 18px rgba(62, 36, 14, 0.28));
}

.gujian-person-timeline__axis-rush {
  transform-box: fill-box;
  transform-origin: center;
  animation: gujian-huanghe-rush-pulse 2.8s ease-in-out infinite;
}

.gujian-person-timeline__axis-midflow {
  stroke-dasharray: 12 16;
  animation: gujian-huanghe-dash 2.2s linear infinite;
}

.gujian-person-timeline__axis-midflow2 {
  stroke-dasharray: 9 12;
  animation: gujian-huanghe-dash 2.85s linear infinite reverse;
}

.gujian-person-timeline__axis-surge-a {
  transform-box: fill-box;
  transform-origin: center;
  animation: gujian-huanghe-surge 2.05s linear infinite;
}

.gujian-person-timeline__axis-surge-b {
  transform-box: fill-box;
  transform-origin: center;
  animation: gujian-huanghe-surge 2.65s linear infinite reverse;
}

@keyframes gujian-huanghe-rush-pulse {
  0%,
  100% {
    transform: translate(-18px, 0) scaleX(1);
    opacity: 0.92;
  }
  50% {
    transform: translate(22px, 0) scaleX(1.04);
    opacity: 1;
  }
}

@keyframes gujian-huanghe-dash {
  to {
    stroke-dashoffset: -96;
  }
}

@keyframes gujian-huanghe-surge {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(72px);
  }
}

.gujian-person-timeline__axis::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='36' viewBox='0 0 96 36'%3E%3Cpath d='M0 10 Q24 4 48 10 T96 10' fill='none' stroke='rgba(255%2C245%2C220%2C0.35)' stroke-width='1.1'/%3E%3Cpath d='M0 18 Q24 24 48 18 T96 18' fill='none' stroke='rgba(90%2C50%2C18%2C0.28)' stroke-width='1'/%3E%3Cpath d='M0 26 Q24 20 48 26 T96 26' fill='none' stroke='rgba(230%2C190%2C100%2C0.22)' stroke-width='0.9'/%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-size: 96px 100%;
  opacity: 0.78;
  mix-blend-mode: soft-light;
  animation: gujian-huanghe-flow 12s linear infinite;
  pointer-events: none;
}

.gujian-person-timeline__axis::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 48%;
  z-index: 2;
  background: linear-gradient(
    180deg,
    rgba(255, 248, 220, 0.32) 0%,
    rgba(212, 165, 88, 0.1) 52%,
    transparent 100%
  );
  mix-blend-mode: overlay;
  pointer-events: none;
}

@keyframes gujian-huanghe-flow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 288px 0;
  }
}

.gujian-person-timeline__mark {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  perspective: 520px;
  transform-style: preserve-3d;
}

.gujian-person-timeline__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  /* 玉璧式：外环鎏金、中朱、内孔，接时间轴线 */
  background:
    radial-gradient(circle at 50% 50%, #2a1810 22%, transparent 24%),
    radial-gradient(circle at 35% 30%, #e8a090, var(--pt-cinnabar) 42%, #6b241c 78%, #3a1410 100%);
  box-shadow:
    0 0 0 1px rgba(201, 162, 88, 0.65),
    0 0 0 3px rgba(250, 240, 228, 0.95),
    0 0 0 4px rgba(92, 58, 36, 0.28),
    0 1px 3px rgba(40, 22, 12, 0.35),
    inset 0 1px 2px rgba(255, 248, 235, 0.35),
    inset 0 -2px 4px rgba(0, 0, 0, 0.22);
  flex-shrink: 0;
}

.gujian-person-timeline__stem {
  width: 4px;
  flex-shrink: 0;
  margin-left: 0;
  margin-right: 0;
  border-radius: 2px;
  /* 漆木杆 + 微竹节暗纹 */
  background:
    repeating-linear-gradient(
      180deg,
      transparent 0,
      transparent 5px,
      rgba(0, 0, 0, 0.06) 5px,
      rgba(0, 0, 0, 0.06) 6px
    ),
    linear-gradient(
      90deg,
      rgba(62, 42, 26, 0.35) 0%,
      #3d2818 22%,
      #2a1e14 50%,
      #3d2818 78%,
      rgba(62, 42, 26, 0.35) 100%
    );
  box-shadow:
    inset 1px 0 0 rgba(255, 252, 245, 0.18),
    inset -1px 0 0 rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(184, 140, 72, 0.22);
  opacity: 0.98;
}

.gujian-person-timeline__stem--down {
  height: clamp(28px, 4.5vw, 44px);
}

.gujian-person-timeline__name {
  margin: 0;
  padding: 10px 6px;
  border: none;
  /* 竖匾式：双边栏 + 顶底托线 */
  background:
    linear-gradient(180deg, rgba(92, 58, 36, 0.2) 0%, transparent 3px, transparent calc(100% - 3px), rgba(92, 58, 36, 0.2) 100%),
    linear-gradient(
      180deg,
      rgba(255, 252, 245, 0.12) 0%,
      transparent 38%,
      transparent 62%,
      rgba(139, 90, 48, 0.06) 100%
    );
  border-left: 1px solid rgba(72, 48, 28, 0.35);
  border-right: 1px solid rgba(72, 48, 28, 0.35);
  box-shadow:
    inset 2px 0 0 rgba(255, 252, 245, 0.45),
    inset -2px 0 0 rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(184, 140, 72, 0.2);
  font-family: inherit;
  font-size: clamp(0.85rem, 1.95vw, 0.98rem);
  font-weight: 700;
  letter-spacing: 0.28em;
  color: var(--pt-ink-soft);
  writing-mode: vertical-rl;
  text-orientation: upright;
  cursor: pointer;
  line-height: 1.55;
  transform-style: preserve-3d;
  text-shadow:
    0 1px 0 rgba(255, 252, 248, 0.95),
    0 2px 2px rgba(255, 255, 255, 0.35),
    1px 2px 3px rgba(28, 20, 14, 0.2),
    0 4px 10px rgba(28, 20, 14, 0.15),
    0 0 1px rgba(60, 48, 36, 0.4);
  filter: drop-shadow(0 5px 10px rgba(36, 28, 18, 0.18)) drop-shadow(0 2px 4px rgba(24, 18, 12, 0.12));
  animation: gujian-name-float 5.2s ease-in-out infinite;
  transition: color 0.25s ease, filter 0.25s ease;
}

.gujian-person-timeline__name:hover {
  color: var(--pt-cinnabar);
  animation-play-state: paused;
  filter: drop-shadow(0 8px 16px rgba(92, 36, 24, 0.15)) drop-shadow(0 3px 6px rgba(139, 58, 50, 0.2));
  text-shadow:
    0 1px 0 rgba(255, 252, 248, 0.98),
    0 2px 3px rgba(255, 255, 255, 0.4),
    0 4px 12px rgba(139, 58, 50, 0.18),
    0 0 1px rgba(92, 36, 24, 0.35);
}

@keyframes gujian-name-float {
  0%,
  100% {
    transform: translateZ(16px) rotateX(6deg) translateY(0);
  }
  50% {
    transform: translateZ(26px) rotateX(3deg) translateY(-6px);
  }
}

.gujian-person-timeline__name:focus {
  outline: none;
}

.gujian-person-timeline__name:focus-visible {
  outline: 2px solid rgba(139, 90, 48, 0.55);
  outline-offset: 5px;
  border-radius: 1px;
}

/* 整幅横卷自中央向左右展开 */
.gujian-person-unfurl-enter-active .gujian-person-timeline__shell {
  transition: clip-path 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.06s;
}

.gujian-person-unfurl-enter-from .gujian-person-timeline__shell {
  clip-path: inset(0 50% 0 50%);
}

.gujian-person-unfurl-enter-to .gujian-person-timeline__shell {
  clip-path: inset(0 0 0 0);
}

@media (prefers-reduced-motion: reduce) {
  .gujian-person-unfurl-enter-active .gujian-person-timeline__shell {
    transition-duration: 0.01ms !important;
  }

  .gujian-person-unfurl-enter-from .gujian-person-timeline__shell {
    clip-path: inset(0 0 0 0);
  }

  .gujian-person-timeline__name {
    animation: none;
    transform: none;
  }

  .gujian-person-timeline__axis::before {
    animation: none !important;
  }

  .gujian-person-timeline__axis-rush,
  .gujian-person-timeline__axis-surge-a,
  .gujian-person-timeline__axis-surge-b {
    animation: none !important;
    transform: none !important;
  }

  .gujian-person-timeline__axis-midflow,
  .gujian-person-timeline__axis-midflow2 {
    animation: none !important;
    stroke-dasharray: unset;
  }

  .gujian-person-modal__panel .gujian-person-modal__col--media,
  .gujian-person-modal__panel .gujian-person-modal__col--body {
    opacity: 1 !important;
    animation: none !important;
    transform: none !important;
    filter: none !important;
  }

  .gujian-person-modal__text-reveal {
    opacity: 1 !important;
    animation: none !important;
    transform: none !important;
  }
}

/* —— 人物详情弹层 —— */
.gujian-person-modal {
  position: fixed;
  inset: 0;
  z-index: 10060;
  display: grid;
  place-items: center;
  padding: clamp(12px, 3vw, 24px);
  box-sizing: border-box;
}

.gujian-person-modal__backdrop {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 100% 80% at 50% 40%, rgba(48, 38, 28, 0.45), rgba(18, 12, 8, 0.72));
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  cursor: pointer;
}

.gujian-person-modal__panel {
  position: relative;
  z-index: 1;
  width: min(720px, 94vw);
  max-height: min(88vh, 720px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 48px clamp(16px, 3vw, 24px) clamp(18px, 3vw, 24px);
  background: linear-gradient(180deg, #faf6ea 0%, #ebe0cc 45%, #e0d0b0 100%);
  border: 2px solid rgba(139, 90, 48, 0.5);
  border-radius: 8px;
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 252, 245, 0.7);
  font-family: 'STKaiti', 'KaiTi', 'FangSong', 'SimSun', 'Microsoft YaHei', serif;
}

.gujian-person-modal__close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(139, 105, 52, 0.55);
  border-radius: 50%;
  background: rgba(255, 252, 245, 0.9);
  color: #5c4033;
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
}

.gujian-person-modal__layout {
  display: grid;
  grid-template-columns: minmax(168px, 36%) minmax(0, 1fr);
  gap: clamp(14px, 2.5vw, 22px);
  align-items: start;
  min-height: 0;
  flex: 1;
}

.gujian-person-modal__col--media {
  min-width: 0;
}

.gujian-person-modal__col--body {
  min-width: 0;
}

.gujian-person-modal__box {
  border: 1px solid rgba(139, 90, 48, 0.42);
  border-radius: 6px;
  background: linear-gradient(165deg, rgba(255, 252, 245, 0.72) 0%, rgba(245, 236, 220, 0.55) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.65),
    0 2px 8px rgba(92, 58, 36, 0.1);
}

.gujian-person-modal__box--media {
  padding: clamp(8px, 1.4vw, 12px);
  height: fit-content;
}

.gujian-person-modal__box--body {
  padding: clamp(12px, 2vw, 18px) clamp(14px, 2.2vw, 20px);
  max-height: min(72vh, 620px);
  overflow-y: auto;
}

.gujian-person-modal__media {
  width: 100%;
  margin: 0;
  min-height: min(200px, 36vh);
  max-height: min(52vh, 420px);
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(160deg, #efe4d4 0%, #e0d0bc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px rgba(139, 105, 72, 0.2);
}

.gujian-person-modal__img {
  width: 100%;
  height: auto;
  max-height: min(52vh, 420px);
  object-fit: contain;
  display: block;
}

.gujian-person-modal__img-placeholder {
  width: min(100%, 200px);
  aspect-ratio: 1;
  max-height: min(52vh, 420px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: rgba(74, 50, 32, 0.25);
  border: 2px dashed rgba(139, 105, 72, 0.35);
  border-radius: 8px;
}

.gujian-person-modal__title {
  margin: 0 0 14px;
  padding-right: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #2a2218;
  line-height: 1.45;
}

.gujian-person-modal__dl {
  margin: 0;
  display: grid;
  grid-template-columns: minmax(4.5em, 32%) 1fr;
  gap: 10px 14px;
  font-size: 0.88rem;
  line-height: 1.65;
}

.gujian-person-modal__dl--row {
  margin: 0 0 10px;
}

.gujian-person-modal__dl--row:last-of-type {
  margin-bottom: 0;
}

.gujian-person-modal__dt {
  margin: 0;
  font-weight: 700;
  color: #6b4a32;
}

.gujian-person-modal__dd {
  margin: 0;
  color: #2c241c;
  word-break: break-word;
}

/* 弹层内：先浮现左侧像，再缓慢浮现右侧介绍 */
@keyframes gujian-person-modal-img-in {
  0% {
    opacity: 0;
    transform: translateX(-16px) scale(0.96);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

/* 右侧各行：自右向左移入，自上而下依次延迟 */
@keyframes gujian-person-modal-line-rtl {
  0% {
    opacity: 0;
    transform: translateX(1.75rem);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.gujian-person-modal-enter-active,
.gujian-person-modal-leave-active {
  transition: opacity 0.28s ease;
}

.gujian-person-modal-enter-active .gujian-person-modal__panel,
.gujian-person-modal-leave-active .gujian-person-modal__panel {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease;
}

.gujian-person-modal-enter-from,
.gujian-person-modal-leave-to {
  opacity: 0;
}

.gujian-person-modal-enter-from .gujian-person-modal__panel,
.gujian-person-modal-leave-to .gujian-person-modal__panel {
  opacity: 0;
  transform: scale(0.94) translateY(12px);
}

/* 等面板入场后再播：由 personModalStagger + @after-enter 触发，与 Transition 时长解耦 */
.gujian-person-modal__panel:not(.gujian-person-modal__panel--stagger) .gujian-person-modal__col--media,
.gujian-person-modal__panel:not(.gujian-person-modal__panel--stagger) .gujian-person-modal__col--body {
  opacity: 0;
}

.gujian-person-modal__panel--stagger .gujian-person-modal__col--media {
  animation: gujian-person-modal-img-in 0.7s cubic-bezier(0.2, 0.85, 0.22, 1) both;
}

.gujian-person-modal__panel--stagger .gujian-person-modal__col--body {
  opacity: 1;
}

.gujian-person-modal__panel--stagger .gujian-person-modal__text-reveal {
  animation: gujian-person-modal-line-rtl 0.85s cubic-bezier(0.18, 0.55, 0.22, 1) both;
  animation-delay: calc(0.42s + var(--row-i, 0) * 0.16s);
}

@media (max-width: 600px) {
  .gujian-person-modal__panel {
    overflow-y: auto;
  }

  .gujian-person-modal__layout {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .gujian-person-modal__col--media,
  .gujian-person-modal__col--body {
    width: 100%;
  }

  .gujian-person-modal__box--body {
    max-height: none;
    overflow-y: visible;
    width: 100%;
    box-sizing: border-box;
  }

  .gujian-person-modal__box--media {
    width: 100%;
    max-width: 280px;
    margin-inline: auto;
    box-sizing: border-box;
  }

  .gujian-person-modal__title {
    text-align: center;
    width: 100%;
  }

  .gujian-person-modal__dl {
    grid-template-columns: 1fr;
  }

  .gujian-person-modal__dd {
    margin-bottom: 8px;
  }
}
</style>
