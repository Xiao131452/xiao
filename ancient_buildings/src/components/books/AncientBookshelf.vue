<template>
  <section class="gujian-book-shelf" aria-label="古风典籍展示">
    <div class="gujian-book-shelf__grid">
      <button
        v-for="book in books"
        :key="book.id"
        type="button"
        class="gujian-book-shelf__item"
        :class="`gujian-book-shelf__item--${book.id}`"
        :aria-label="`打开${book.title}`"
        @click="openBook(book)"
      >
        <div class="gujian-book-closed-3d">
          <div class="gujian-book-closed-3d__spine" aria-hidden="true" />
          <div class="gujian-book-closed-3d__body">
            <div class="gujian-book-closed-3d__top" aria-hidden="true" />
            <div class="gujian-book-closed-3d__cover" :style="{ '--gujian-accent': book.accent }">
              <svg class="gujian-book-svg-roof" viewBox="0 0 200 120" aria-hidden="true">
                <defs>
                  <linearGradient :id="`gujian-ink-${book.id}`" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1a1510" stop-opacity="0.85" />
                    <stop offset="100%" stop-color="#3d3530" stop-opacity="0.5" />
                  </linearGradient>
                </defs>
                <path
                  :fill="`url(#gujian-ink-${book.id})`"
                  d="M20 95 L100 25 L180 95 Z M45 95 L100 48 L155 95 Z M70 95 L100 68 L130 95 Z"
                />
                <rect x="35" y="95" width="130" height="8" rx="1" fill="#2c241c" opacity="0.7" />
                <circle cx="100" cy="102" r="3" fill="#8b2942" opacity="0.9" />
              </svg>
              <span class="gujian-book-closed-3d__title">{{ book.title }}</span>
            </div>
          </div>
          <div class="gujian-book-closed-3d__fore" aria-hidden="true" />
        </div>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="gujian-book-fade">
        <div
          v-if="active"
          class="gujian-book-overlay"
          role="dialog"
          aria-modal="true"
          :aria-label="active.title"
          @click.self="closeBook"
        >
          <div class="gujian-book-modal" :class="{ 'gujian-book-modal--zoom': zoomed }">
            <button type="button" class="gujian-book-modal__close" aria-label="关闭" @click="closeBook">
              ×
            </button>

            <div class="gujian-book-modal__inner gujian-book-modal__inner--scroll">
              <div
                class="gujian-scroll-drag"
                @pointerdown="onPointerDown"
                @pointermove="onPointerMove"
                @pointerup="onPointerUp"
                @pointerleave="onPointerUp"
                @pointercancel="onPointerUp"
              >
                <div
                  class="gujian-scroll"
                  :class="{ 'gujian-scroll--open': hingeOpen }"
                  :style="{ '--gujian-scroll-accent': active.accent }"
                >
                  <div class="gujian-scroll__roller gujian-scroll__roller--left" aria-hidden="true">
                    <span class="gujian-scroll__roller-cap gujian-scroll__roller-cap--left" />
                    <span class="gujian-scroll__roller-shaft" />
                  </div>

                  <div class="gujian-scroll__sheet">
                    <div class="gujian-scroll__mount gujian-scroll__mount--top" aria-hidden="true" />
                    <div class="gujian-scroll__paper">
                      <Transition
                        :name="flipDir === 'next' ? 'gujian-scroll-seg-next' : 'gujian-scroll-seg-prev'"
                        mode="out-in"
                      >
                        <div :key="spreadKey" class="gujian-scroll__segment">
                          <p class="gujian-scroll__volume-title">{{ active.title }}</p>
                          <div class="gujian-scroll__cols">
                            <div
                              class="gujian-scroll__col gujian-scroll__col--prev"
                              role="button"
                              tabindex="0"
                              aria-label="上一段"
                              @click="prevPage"
                              @keydown.enter.prevent="prevPage"
                              @keydown.space.prevent="prevPage"
                            >
                              <h4 class="gujian-scroll__h">{{ currentSpread.leftTitle }}</h4>
                              <p
                                v-for="(para, i) in currentSpread.leftParas"
                                :key="'sl' + i"
                                class="gujian-scroll__p"
                              >
                                {{ para }}
                              </p>
                            </div>
                            <div class="gujian-scroll__col-rule" aria-hidden="true" />
                            <div
                              class="gujian-scroll__col gujian-scroll__col--next"
                              role="button"
                              tabindex="0"
                              aria-label="下一段"
                              @click="nextPage"
                              @keydown.enter.prevent="nextPage"
                              @keydown.space.prevent="nextPage"
                            >
                              <h4 class="gujian-scroll__h">{{ currentSpread.rightTitle }}</h4>
                              <p
                                v-for="(para, i) in currentSpread.rightParas"
                                :key="'sr' + i"
                                class="gujian-scroll__p"
                              >
                                {{ para }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Transition>
                    </div>
                    <div class="gujian-scroll__mount gujian-scroll__mount--bottom" aria-hidden="true" />
                  </div>

                  <div class="gujian-scroll__roller gujian-scroll__roller--right" aria-hidden="true">
                    <span class="gujian-scroll__roller-shaft" />
                    <span class="gujian-scroll__roller-cap gujian-scroll__roller-cap--right" />
                  </div>
                </div>
              </div>

              <div class="gujian-book-toolbar">
                <button type="button" class="gujian-book-toolbar__btn" aria-label="上一段" @click="prevPage">
                  ‹ 上一段
                </button>
                <span class="gujian-book-toolbar__meta">
                  {{ spreadIndex + 1 }} / {{ active.spreads.length }}
                </span>
                <button type="button" class="gujian-book-toolbar__btn" aria-label="下一段" @click="nextPage">
                  下一段 ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const books = [
  {
    id: 'huazhang',
    title: '《栋宇华章》',
    accent: '#8b4513',
    spreads: [
      {
        leftTitle: '卷首 · 简介',
        leftParas: [
          '本书汇录华夏木构建筑之气象：殿堂楼阁、飞檐反宇，承千年匠意与礼制秩序，以示栋宇之华章。'
        ],
        rightTitle: '第一章 · 飞檐与屋面',
        rightParas: [
          '屋面举折与翼角起翘，使雨水远掷、轮廓舒展；瓦作叠垄与脊饰，兼寓防火与等级象征。观檐下阴影，可知地方风格与年代特征。'
        ]
      },
      {
        leftTitle: '第二章 · 斗拱与铺作',
        leftParas: [
          '斗拱层叠以悬挑屋檐、传递荷载，宋《营造法式》与清式做法各有谱系。铺作疏密与出跳深度，常为断代与辨型之要键。'
        ],
        rightTitle: '第三章 · 殿堂格局',
        rightParas: [
          '面阔进深、柱网与梁架决定空间尺度；金箱斗底槽、副阶周匝等术语背后，是礼制、功能与结构合一的设计逻辑。'
        ]
      },
      {
        leftTitle: '第四章 · 园林与院落',
        leftParas: [
          '墙垣、游廊与洞门划分景深；亭台借景、水面映构，使人工与自然互成对景，体现“虽由人作，宛自天开”。'
        ],
        rightTitle: '第五章 · 装饰与彩画',
        rightParas: [
          '木雕、石雕与彩画题材多取吉祥纹样与故事；和玺、旋子、苏式等彩画等级分明，既护木防腐，亦彰建筑身份。'
        ]
      }
    ]
  },
  {
    id: 'lianggong',
    title: '《栋宇良工》',
    accent: '#6b4423',
    spreads: [
      {
        leftTitle: '序 · 良工述要',
        leftParas: [
          '大木、小木、瓦作、石作相辅相成；榫卯咬合、不用一钉而可传数百年，此非虚誉，乃历代匠师经验之凝结。'
        ],
        rightTitle: '第一编 · 榫卯概要',
        rightParas: [
          '燕尾榫、穿带、挂落与斗口咬合，皆在限位与传力之间求平衡。理解纹路与受力方向，方能读解老架与新作的异同。'
        ]
      },
      {
        leftTitle: '第二编 · 大木作',
        leftParas: [
          '柱、梁、檩、椽构成骨架；侧脚、生起与榫卯节点共同提高整体刚度。落架大修时需编号、测绘，以存原构信息。'
        ],
        rightTitle: '第三编 · 小木作与雕饰',
        rightParas: [
          '门窗、栏杆、藻井等细部，集实用与美学于一体；刀法、题材与地仗层次，均为地方匠派的重要指纹。'
        ]
      },
      {
        leftTitle: '第四编 · 瓦作与泥作',
        leftParas: [
          '苫背、捉节夹垄关系防水寿命；砖墁地面与台基砌筑需排水通畅，以免潮气内侵木柱墩接部位。'
        ],
        rightTitle: '第五编 · 修缮与匠艺',
        rightParas: [
          '最小干预、可逆性与可识别性为现代修缮共识；传统工具与工序的纪录与传承，与新材料试验同样值得重视。'
        ]
      }
    ]
  },
  {
    id: 'zhengce',
    title: '《国家政策》',
    accent: '#7c2626',
    spreads: [
      {
        leftTitle: '导言',
        leftParas: [
          '文物保护法治与规划体系，旨在平衡传承、安全与合理利用。本书摘编政策要义，便于查阅与对照实务。'
        ],
        rightTitle: '第一章 · 文物保护法要义',
        rightParas: [
          '保护为主、抢救第一、合理利用、加强管理为方针；不可移动文物分级保护，修缮、迁移与用途变更须依法报批。'
        ]
      },
      {
        leftTitle: '第二章 · 名录与分级',
        leftParas: [
          '全国重点文物保护单位、省级与市县级名录构成层级体系；历史建筑、传统村落等认定，拓展了保护对象的外延。'
        ],
        rightTitle: '第三章 · 修缮审批要点',
        rightParas: [
          '勘察设计、施工资质与竣工验收环环相扣；修缮方案应基于价值评估，避免破坏性“焕然一新”式改造。'
        ]
      },
      {
        leftTitle: '第四章 · 活化利用',
        leftParas: [
          '在确保安全与真实性的前提下，可探索展示、研学与社区服务等功能；须防止过度商业化损害文物本体与环境。'
        ],
        rightTitle: '第五章 · 公众参与',
        rightParas: [
          '志愿服务、监督举报与社会教育，是保护网络的重要一环。知法、守法与善用程序，共同维护文化遗产的公共利益。'
        ]
      }
    ]
  }
]

const active = ref(null)
const hingeOpen = ref(false)
const zoomed = ref(false)
const spreadIndex = ref(0)
const flipDir = ref('next')

const spreadKey = computed(() => `${active.value?.id ?? ''}-${spreadIndex.value}`)

const currentSpread = computed(() => {
  if (!active.value) {
    return {
      leftTitle: '',
      leftParas: [],
      rightTitle: '',
      rightParas: []
    }
  }
  return active.value.spreads[spreadIndex.value] ?? active.value.spreads[0]
})

let hingeTimer = null
let dragStartX = 0
let dragging = false

function openBook(book) {
  active.value = book
  spreadIndex.value = 0
  hingeOpen.value = false
  zoomed.value = false
  nextTick(() => {
    requestAnimationFrame(() => {
      zoomed.value = true
      hingeTimer = window.setTimeout(() => {
        hingeOpen.value = true
      }, 120)
    })
  })
}

function closeBook() {
  hingeOpen.value = false
  zoomed.value = false
  window.clearTimeout(hingeTimer)
  hingeTimer = window.setTimeout(() => {
    active.value = null
  }, 520)
}

function nextPage() {
  if (!active.value) return
  if (spreadIndex.value < active.value.spreads.length - 1) {
    flipDir.value = 'next'
    spreadIndex.value += 1
  }
}

function prevPage() {
  if (spreadIndex.value > 0) {
    flipDir.value = 'prev'
    spreadIndex.value -= 1
  }
}

function onPointerDown(e) {
  if (!hingeOpen.value) return
  dragging = true
  dragStartX = e.clientX
  e.currentTarget.setPointerCapture?.(e.pointerId)
}

function onPointerMove(e) {
  if (!dragging) return
  e.preventDefault()
}

function onPointerUp(e) {
  if (!dragging) return
  dragging = false
  const dx = e.clientX - dragStartX
  const threshold = 56
  if (dx > threshold) prevPage()
  else if (dx < -threshold) nextPage()
  try {
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  } catch {
    /* ignore */
  }
}

function onKeydown(e) {
  if (!active.value) return
  if (e.key === 'Escape') closeBook()
  if (e.key === 'ArrowLeft') prevPage()
  if (e.key === 'ArrowRight') nextPage()
}

watch(active, (v) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = v ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  window.clearTimeout(hingeTimer)
})
</script>

<style scoped>
.gujian-book-shelf {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(92, 64, 51, 0.2);
}

.gujian-book-shelf__grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(56px, 11vw, 140px);
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px 24px 32px;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
}

.gujian-book-shelf__item {
  flex: 0 0 auto;
  border: none;
  background: transparent;
  padding: 16px 18px 24px;
  cursor: pointer;
  border-radius: 14px;
  transition: transform 0.32s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.gujian-book-shelf__item:hover {
  transform: translateY(-10px) scale(1.05);
}

.gujian-book-shelf__item:focus-visible {
  outline: 2px solid rgba(139, 69, 19, 0.55);
  outline-offset: 6px;
}

.gujian-book-closed-3d {
  display: flex;
  align-items: stretch;
  width: 200px;
  height: 274px;
  perspective: 720px;
  perspective-origin: 40% 50%;
  transform-style: preserve-3d;
  filter: drop-shadow(8px 12px 20px rgba(38, 26, 18, 0.42));
  transition: filter 0.32s ease;
}

.gujian-book-shelf__item:hover .gujian-book-closed-3d,
.gujian-book-shelf__item:focus-visible .gujian-book-closed-3d {
  filter:
    drop-shadow(14px 22px 32px rgba(42, 28, 18, 0.58))
    drop-shadow(6px 12px 20px rgba(58, 38, 26, 0.48))
    drop-shadow(0 4px 8px rgba(30, 20, 14, 0.35));
}

.gujian-book-closed-3d__spine {
  width: 26px;
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    #1a120c 0%,
    #3d2a20 35%,
    #5c4030 55%,
    #2a1c14 100%
  );
  box-shadow:
    inset -4px 0 10px rgba(0, 0, 0, 0.55),
    inset 2px 0 4px rgba(92, 72, 58, 0.25);
  border-radius: 5px 0 0 5px;
  transform: rotateY(-6deg);
  transform-origin: right center;
}

.gujian-book-closed-3d__body {
  position: relative;
  flex: 1;
  min-width: 0;
  transform: rotateY(-14deg);
  transform-origin: left center;
  transform-style: preserve-3d;
  transition: transform 0.32s ease;
}

.gujian-book-shelf__item:hover .gujian-book-closed-3d__body {
  transform: rotateY(-18deg) translateZ(10px);
}

.gujian-book-closed-3d__top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 11px;
  z-index: 2;
  border-radius: 0 6px 0 0;
  background: repeating-linear-gradient(
    90deg,
    #f2e8d8 0px,
    #f2e8d8 5px,
    #d8c8b0 5px,
    #d8c8b0 6px
  );
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 252, 245, 0.45);
  pointer-events: none;
}

.gujian-book-closed-3d__cover {
  height: 100%;
  border-radius: 0 8px 8px 0;
  padding: 22px 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background:
    linear-gradient(145deg, rgba(255, 252, 245, 0.2) 0%, transparent 42%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(60, 48, 36, 0.05) 2px,
      rgba(60, 48, 36, 0.05) 3px
    ),
    linear-gradient(155deg, #ebe0d0 0%, #c9b89a 45%, var(--gujian-accent, #8b4513) 100%);
  border: 1px solid rgba(44, 36, 28, 0.42);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.14),
    inset -6px 0 14px rgba(44, 36, 28, 0.12),
    2px 0 8px rgba(0, 0, 0, 0.12);
}

.gujian-book-closed-3d__fore {
  width: 12px;
  flex-shrink: 0;
  margin-left: -3px;
  border-radius: 0 5px 5px 0;
  background: linear-gradient(90deg, #a89880 0%, #d4c4a8 40%, #c4b498 100%);
  box-shadow:
    inset 2px 0 6px rgba(255, 255, 255, 0.2),
    inset -2px 0 8px rgba(44, 36, 28, 0.2),
    4px 6px 12px rgba(30, 20, 14, 0.25);
  transform: rotateY(-14deg);
  transform-origin: left center;
}

.gujian-book-svg-roof {
  width: 100%;
  max-height: 92px;
  opacity: 0.95;
}

.gujian-book-closed-3d__title {
  font-family: 'STKaiti', 'KaiTi', 'SimSun', serif;
  font-size: 1.08rem;
  font-weight: 700;
  color: #1a1510;
  text-shadow: 0 1px 0 rgba(255, 248, 235, 0.6);
  letter-spacing: 0.08em;
  writing-mode: vertical-rl;
  text-orientation: upright;
  line-height: 1.5;
  max-height: 200px;
}

/* —— 弹层 —— */
.gujian-book-overlay {
  position: fixed;
  inset: 0;
  z-index: 10040;
  background: rgba(20, 14, 10, 0.72);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.gujian-book-modal {
  position: relative;
  max-width: min(960px, 100%);
  transform: scale(0.72);
  opacity: 0.85;
  transition:
    transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1),
    opacity 0.45s ease;
}

.gujian-book-modal--zoom {
  transform: scale(1);
  opacity: 1;
}

.gujian-book-modal__close {
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 10;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(145deg, #f0e6d8, #c9b89a);
  color: #2a1810;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.gujian-book-modal__close:hover {
  filter: brightness(1.08);
}

.gujian-book-modal__inner {
  padding: 20px 16px 12px;
  background: linear-gradient(180deg, #2a2218 0%, #1a1510 100%);
  border-radius: 12px;
  border: 1px solid rgba(201, 184, 150, 0.25);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 248, 235, 0.08);
}

.gujian-book-modal__inner--scroll {
  padding-top: 24px;
}

/* —— 卷轴（横向展开） —— */
.gujian-scroll-drag {
  touch-action: pan-y;
  cursor: grab;
  padding: 8px 4px 20px;
}

.gujian-scroll-drag:active {
  cursor: grabbing;
}

.gujian-scroll {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  max-width: 100%;
  margin: 0 auto;
  filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.45));
}

.gujian-scroll__roller {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex-shrink: 0;
  width: 40px;
  z-index: 2;
}

.gujian-scroll__roller--left {
  justify-content: flex-end;
}

.gujian-scroll__roller--right {
  justify-content: flex-start;
}

.gujian-scroll__roller-shaft {
  width: 14px;
  align-self: stretch;
  min-height: 300px;
  background: linear-gradient(
    90deg,
    #1a100c 0%,
    #4a3224 35%,
    #2a1c14 65%,
    #0f0a08 100%
  );
  box-shadow:
    inset 3px 0 8px rgba(0, 0, 0, 0.55),
    inset -2px 0 6px rgba(120, 90, 70, 0.2);
}

.gujian-scroll__roller--left .gujian-scroll__roller-shaft {
  border-radius: 10px 0 0 10px;
}

.gujian-scroll__roller--right .gujian-scroll__roller-shaft {
  border-radius: 0 10px 10px 0;
}

.gujian-scroll__roller-cap {
  width: 26px;
  align-self: center;
  min-height: 88%;
  max-height: 340px;
  border-radius: 10px;
  background:
    radial-gradient(ellipse 70% 45% at 40% 28%, rgba(120, 86, 58, 0.45), transparent 55%),
    linear-gradient(145deg, #5c3d28 0%, #2a1810 45%, #1a0f0a 100%);
  box-shadow:
    inset 0 2px 6px rgba(255, 248, 235, 0.12),
    inset 0 -6px 14px rgba(0, 0, 0, 0.55),
    4px 0 12px rgba(0, 0, 0, 0.35);
}

.gujian-scroll__roller-cap--left {
  margin-right: -1px;
}

.gujian-scroll__roller-cap--right {
  margin-left: -1px;
}

.gujian-scroll__sheet {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition:
    max-width 1s cubic-bezier(0.34, 0.82, 0.32, 1),
    opacity 0.45s ease 0.12s;
}

.gujian-scroll--open .gujian-scroll__sheet {
  max-width: min(620px, 82vw);
  opacity: 1;
}

.gujian-scroll__mount {
  flex-shrink: 0;
  height: 14px;
  background: linear-gradient(
    180deg,
    #1e2a22 0%,
    #2d3d32 40%,
    #1a221c 100%
  );
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.35);
}

.gujian-scroll__mount--top {
  border-bottom: 1px solid rgba(201, 184, 150, 0.2);
}

.gujian-scroll__mount--bottom {
  border-top: 1px solid rgba(201, 184, 150, 0.2);
}

.gujian-scroll__paper {
  flex: 1;
  min-height: 280px;
  width: 100%;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(180, 150, 110, 0.18) 0%, transparent 8%, transparent 92%, rgba(180, 150, 110, 0.18) 100%),
    repeating-linear-gradient(
      0deg,
      #f4ead8,
      #f4ead8 26px,
      rgba(160, 130, 100, 0.12) 26px,
      rgba(160, 130, 100, 0.12) 27px
    );
  border-left: 2px solid rgba(92, 62, 42, 0.35);
  border-right: 2px solid rgba(92, 62, 42, 0.35);
  box-shadow: inset 0 0 40px rgba(92, 62, 42, 0.06);
}

.gujian-scroll__segment {
  padding: 22px 22px 26px;
  font-family: 'STKaiti', 'KaiTi', 'SimSun', 'Georgia', serif;
  color: #2a2218;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.gujian-scroll__volume-title {
  margin: 0 0 18px;
  text-align: center;
  font-size: 1.05rem;
  font-weight: 700;
  color: #5c2e20;
  letter-spacing: 0.2em;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(124, 38, 38, 0.35);
  border-bottom: 2px solid color-mix(in srgb, var(--gujian-scroll-accent, #8b4513) 55%, rgba(124, 38, 38, 0.35));
}

.gujian-scroll__cols {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0 16px;
  align-items: start;
}

.gujian-scroll__col {
  min-width: 0;
  cursor: pointer;
  user-select: none;
  padding: 8px 4px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.gujian-scroll__col:hover {
  background: rgba(139, 69, 19, 0.06);
}

.gujian-scroll__col-rule {
  width: 2px;
  min-height: 120px;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(92, 46, 32, 0.35) 15%,
    rgba(92, 46, 32, 0.35) 85%,
    transparent
  );
  border-radius: 1px;
}

.gujian-scroll__h {
  margin: 0 0 10px;
  font-size: 0.98rem;
  color: #6b3a28;
  font-weight: 700;
}

.gujian-scroll__p {
  margin: 0 0 12px;
  font-size: 0.9rem;
  line-height: 1.8;
  text-align: justify;
}

.gujian-book-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 14px;
}

.gujian-book-toolbar__btn {
  padding: 8px 16px;
  border: 1px solid rgba(201, 184, 150, 0.35);
  border-radius: 6px;
  background: rgba(244, 232, 216, 0.12);
  color: #e8dcc8;
  font-size: 0.88rem;
  cursor: pointer;
  font-family: inherit;
}

.gujian-book-toolbar__btn:hover {
  background: rgba(244, 232, 216, 0.22);
}

.gujian-book-toolbar__meta {
  font-size: 0.85rem;
  color: rgba(232, 220, 200, 0.75);
  min-width: 52px;
  text-align: center;
}

/* 卷轴换段：横向慢慢卷起 / 展开（模拟绕轴卷动） */
.gujian-scroll-seg-next-leave-active {
  transform-origin: left center;
  transition:
    transform 1.2s cubic-bezier(0.52, 0.02, 0.6, 0.28),
    opacity 1s ease;
}

.gujian-scroll-seg-next-leave-to {
  transform: scaleX(0.04);
  opacity: 0.12;
}

.gujian-scroll-seg-next-enter-active {
  transform-origin: right center;
  transition:
    transform 1.45s cubic-bezier(0.18, 0.82, 0.25, 1),
    opacity 1.15s ease;
}

.gujian-scroll-seg-next-enter-from {
  transform: scaleX(0.04);
  opacity: 0;
}

.gujian-scroll-seg-prev-leave-active {
  transform-origin: right center;
  transition:
    transform 1.2s cubic-bezier(0.52, 0.02, 0.6, 0.28),
    opacity 1s ease;
}

.gujian-scroll-seg-prev-leave-to {
  transform: scaleX(0.04);
  opacity: 0.12;
}

.gujian-scroll-seg-prev-enter-active {
  transform-origin: left center;
  transition:
    transform 1.45s cubic-bezier(0.18, 0.82, 0.25, 1),
    opacity 1.15s ease;
}

.gujian-scroll-seg-prev-enter-from {
  transform: scaleX(0.04);
  opacity: 0;
}

.gujian-book-fade-enter-active,
.gujian-book-fade-leave-active {
  transition: opacity 0.3s ease;
}
.gujian-book-fade-enter-from,
.gujian-book-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .gujian-scroll__roller {
    width: 32px;
  }

  .gujian-scroll__roller-cap {
    width: 22px;
  }

  .gujian-scroll--open .gujian-scroll__sheet {
    max-width: min(100%, 92vw);
  }

  .gujian-scroll__cols {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .gujian-scroll__col-rule {
    width: 100%;
    height: 2px;
    min-height: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(92, 46, 32, 0.35) 20%,
      rgba(92, 46, 32, 0.35) 80%,
      transparent
    );
  }

  .gujian-scroll__roller-shaft {
    min-height: 260px;
  }
}

@media (max-width: 720px) {
  .gujian-book-shelf__grid {
    gap: clamp(36px, 8vw, 72px);
  }
}

@media (max-width: 420px) {
  .gujian-book-shelf__grid {
    justify-content: flex-start;
    gap: clamp(28px, 6vw, 48px);
    padding-inline: 16px;
  }
}
</style>
