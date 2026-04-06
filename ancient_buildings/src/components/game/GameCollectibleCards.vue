<template>
  <!-- 全屏胜利画面：与参考图一致，用整图呈现；点「收下」后正式解锁并播收集动画 -->
  <Teleport to="body">
    <Transition name="game-victory-fade">
      <div
        v-if="pendingVictoryIndex !== null && pendingVictorySlot"
        class="game-victory-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-victory-heading"
      >
        <div class="game-victory-overlay__bg" aria-hidden="true" />
        <div class="game-victory-overlay__festive" aria-hidden="true">
          <div class="game-victory-festive__bottom-glow" />
          <div class="game-victory-festive__rays" />
          <div class="game-victory-festive__bokeh" />
          <div class="game-victory-festive__confetti" />
        </div>
        <div class="game-victory-overlay__fireworks" aria-hidden="true">
          <div class="game-victory-fire-warm" />
          <canvas ref="fireworksCanvasRef" class="game-victory-overlay__fireworks-canvas" />
        </div>
        <h2 id="game-victory-heading" class="game-victory-overlay__title">
          胜利！获得古建筑卡牌
        </h2>
        <div class="game-victory-overlay__main">
          <div class="game-victory-overlay__right">
            <div class="game-victory-overlay__card-info-row">
              <div class="game-victory-overlay__card-wrap">
                <img
                  class="game-victory-overlay__card-img"
                  :src="victoryArtSrc"
                  :alt="`奖励卡牌：${pendingVictorySlot.name}`"
                  decoding="async"
                />
              </div>
              <div class="game-victory-overlay__info" role="region" aria-label="建筑介绍">
                <h3 class="game-victory-overlay__building-name">{{ pendingVictorySlot.name }}</h3>
                <p class="game-victory-overlay__era">
                  <span class="game-victory-overlay__label">建筑朝代</span>
                  <span class="game-victory-overlay__value">{{ pendingVictorySlot.era }}</span>
                </p>
                <p class="game-victory-overlay__features">
                  <span class="game-victory-overlay__label">建筑特色</span>
                  <span class="game-victory-overlay__value">{{ pendingVictorySlot.features }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="game-victory-overlay__cta" @click="confirmVictory">
          收下奖励
        </button>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <div
      v-show="visible"
      class="collect-luxe"
      aria-label="收集卡牌"
    >
      <div class="collect-luxe__trap">
        <div ref="collectStripRef" class="collect-luxe__row">
          <span class="collect-luxe__count" aria-live="polite">
            已收集: {{ unlockedCount }}/3
          </span>
          <div class="collect-luxe__slots">
            <button
              v-for="(slot, i) in GAME_REWARD_SLOTS"
              :key="slot.id"
              type="button"
              class="collect-card collect-card--bar"
              :class="{
                'collect-card--unlocked': gameCollectUnlocked[i],
                'collect-card--locked': !gameCollectUnlocked[i],
              }"
              :data-card-index="i"
              :aria-label="`${slot.name}${gameCollectUnlocked[i] ? '已获得' : '未获得'}`"
              :title="
                gameCollectUnlocked[i]
                  ? `已获得：${slot.name}`
                  : `未获得：完成${slot.miniGameLabel}并结束会话`
              "
              @click="onCardClick(i)"
            >
              <span class="collect-card__inner">
                <img
                  class="collect-card__img"
                  :src="gameRewardImage(slot.victoryImage)"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
            </button>
          </div>
          <button
            type="button"
            class="collect-luxe__cta"
            :class="{ 'collect-luxe__cta--active': allUnlocked }"
            :disabled="!allUnlocked"
            aria-label="三张卡牌已全部收集"
          >
            挑战成功
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="celebrating != null && celebrateFace"
      class="collect-celebrate"
      aria-hidden="true"
    >
      <div
        ref="celebrateElRef"
        class="collect-celebrate__card"
        :style="{ backgroundImage: `url('${celebrateImageSrc}')` }"
      >
        <span class="collect-celebrate__title">{{ celebrateFace.name }}</span>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <Transition name="collect-preview">
      <div
        v-if="enlargedFace"
        class="collect-preview"
        role="presentation"
        @click.self="closeCardPreview"
      >
        <div
          class="collect-preview__panel"
          role="dialog"
          aria-modal="true"
          :aria-label="`放大查看：${enlargedFace.name}`"
          @click.stop
        >
          <button
            type="button"
            class="collect-preview__close"
            aria-label="关闭"
            @click="closeCardPreview"
          >
            ×
          </button>
          <div
            class="collect-preview__card"
            :class="{ 'collect-preview__card--locked': enlargedLocked }"
          >
            <img
              class="collect-preview__img"
              :src="gameRewardImage(enlargedFace.victoryImage)"
              :alt="enlargedFace.name"
            />
            <span class="collect-preview__title">{{ enlargedFace.name }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { GAME_REWARD_SLOTS, gameRewardImage } from '../../data/gameRewardCards.js'
import {
  gameCollectUnlocked,
  hydrateGameCollectUnlocked,
  unlockGameCollectSlot,
  MINI_GAME_EXIT_EVENT,
} from '../../composables/gameCollectibleState.js'

defineProps({
  visible: { type: Boolean, default: true },
})

const pendingVictoryIndex = ref(null)
const celebrating = ref(null)
const celebrateElRef = ref(null)
const collectStripRef = ref(null)
const enlargedIndex = ref(null)
const fireworksCanvasRef = ref(null)
const fireworksParticles = []
const fireworksBlooms = []
let celebrateAnim = null
let fireworksRafId = 0
let fireworksBurstTimer = 0
let fireworksStaggerTimer = 0
let fireworksResizeHandler = null

const pendingVictorySlot = computed(() => {
  const i = pendingVictoryIndex.value
  if (i == null) return null
  return GAME_REWARD_SLOTS[i] || null
})

const victoryArtSrc = computed(() =>
  pendingVictorySlot.value
    ? gameRewardImage(pendingVictorySlot.value.victoryImage)
    : '',
)

const celebrateFace = computed(() => {
  const i = celebrating.value
  if (i == null) return null
  return GAME_REWARD_SLOTS[i] || null
})

const celebrateImageSrc = computed(() =>
  celebrateFace.value
    ? gameRewardImage(celebrateFace.value.victoryImage)
    : '',
)

const unlockedCount = computed(() => gameCollectUnlocked.value.filter(Boolean).length)

const allUnlocked = computed(() => gameCollectUnlocked.value.every(Boolean))

const enlargedFace = computed(() => {
  const i = enlargedIndex.value
  if (i == null) return null
  return GAME_REWARD_SLOTS[i] || null
})

const enlargedLocked = computed(
  () =>
    enlargedIndex.value != null && !gameCollectUnlocked.value[enlargedIndex.value],
)

function onMiniGameExit(ev) {
  const slot = Number(ev.detail?.gameSlot)
  if (!Number.isFinite(slot) || slot < 1 || slot > 3) return
  const idx = slot - 1
  if (gameCollectUnlocked.value[idx]) return
  if (pendingVictoryIndex.value !== null || celebrating.value != null) return
  pendingVictoryIndex.value = idx
}

function confirmVictory() {
  const idx = pendingVictoryIndex.value
  if (idx == null) return
  pendingVictoryIndex.value = null
  if (!gameCollectUnlocked.value[idx]) {
    unlockGameCollectSlot(idx)
  }
  startCelebration(idx)
}

function onVictoryKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    confirmVictory()
  }
}

function randomVictoryBurstPoint() {
  const w = window.innerWidth
  const h = window.innerHeight
  return {
    x: w * (0.08 + Math.random() * 0.84),
    y: h * (0.05 + Math.random() * 0.34),
  }
}

function spawnVictoryBurst(cx, cy) {
  const count = 140 + Math.floor(Math.random() * 100)
  for (let i = 0; i < count; i++) {
    const theta = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.42
    const speed =
      (0.85 + Math.random() * 2.35) * (0.52 + Math.random() * 0.68)
    fireworksParticles.push({
      x: cx,
      y: cy,
      lx: cx,
      ly: cy,
      vx: Math.cos(theta) * speed,
      vy: Math.sin(theta) * speed,
      life: 1,
      decay: 0.002 + Math.random() * 0.0048,
      width: 0.32 + Math.random() * 1.05,
      purpleTip: Math.random() < 0.13,
    })
  }
  const flashN = 36 + Math.floor(Math.random() * 26)
  for (let i = 0; i < flashN; i++) {
    const theta = Math.random() * Math.PI * 2
    const speed = Math.random() * 1.25
    fireworksParticles.push({
      x: cx,
      y: cy,
      lx: cx,
      ly: cy,
      vx: Math.cos(theta) * speed,
      vy: Math.sin(theta) * speed,
      life: 0.92,
      decay: 0.014 + Math.random() * 0.014,
      width: 1.1 + Math.random() * 0.9,
      purpleTip: false,
    })
  }
  fireworksBlooms.push({
    cx,
    cy,
    t: 0,
    maxT: 38 + Math.floor(Math.random() * 32),
  })
}

function resizeVictoryFireworksCanvas() {
  const el = fireworksCanvasRef.value
  if (!el) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = Math.floor(window.innerWidth * dpr)
  el.height = Math.floor(window.innerHeight * dpr)
  el.style.width = `${window.innerWidth}px`
  el.style.height = `${window.innerHeight}px`
}

function drawVictoryFireworksFrame() {
  const el = fireworksCanvasRef.value
  if (!el || pendingVictoryIndex.value == null) {
    fireworksRafId = 0
    return
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const ctx = el.getContext('2d')
  if (!ctx) {
    fireworksRafId = 0
    return
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = 'rgba(6, 5, 4, 0.11)'
  ctx.fillRect(0, 0, el.width, el.height)

  ctx.globalCompositeOperation = 'lighter'
  for (let i = fireworksBlooms.length - 1; i >= 0; i--) {
    const b = fireworksBlooms[i]
    b.t += 1
    const prog = b.t / b.maxT
    if (prog >= 1) {
      fireworksBlooms.splice(i, 1)
      continue
    }
    const r = (28 + prog * 138) * dpr
    const bx = b.cx * dpr
    const by = b.cy * dpr
    const fade = 1 - prog
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, r)
    g.addColorStop(0, `rgba(255, 253, 240, ${0.72 * fade})`)
    g.addColorStop(0.1, `rgba(255, 236, 180, ${0.5 * fade})`)
    g.addColorStop(0.28, `rgba(255, 200, 95, ${0.28 * fade})`)
    g.addColorStop(0.55, `rgba(255, 170, 60, ${0.1 * fade})`)
    g.addColorStop(1, 'rgba(255, 150, 40, 0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(bx, by, r, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let i = fireworksParticles.length - 1; i >= 0; i--) {
    const p = fireworksParticles[i]
    p.lx = p.x
    p.ly = p.y
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.012
    p.vx *= 0.997
    p.vy *= 0.997
    p.life -= p.decay
    if (p.life <= 0) {
      fireworksParticles.splice(i, 1)
      continue
    }
    const x0 = p.lx * dpr
    const y0 = p.ly * dpr
    const x1 = p.x * dpr
    const y1 = p.y * dpr
    const grd = ctx.createLinearGradient(x0, y0, x1, y1)
    grd.addColorStop(0, `rgba(255,255,255,${0.94 * p.life})`)
    grd.addColorStop(0.18, `rgba(255, 248, 220,${0.84 * p.life})`)
    grd.addColorStop(0.42, `rgba(255, 215, 110,${0.52 * p.life})`)
    grd.addColorStop(
      1,
      p.purpleTip
        ? `rgba(185, 175, 255,${0.35 * p.life})`
        : `rgba(255, 190, 75,${0.22 * p.life})`,
    )
    ctx.strokeStyle = grd
    ctx.lineWidth = Math.max(0.5, p.width * (0.45 + p.life * 0.6) * dpr)
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }

  ctx.globalCompositeOperation = 'source-over'
  fireworksRafId = requestAnimationFrame(drawVictoryFireworksFrame)
}

function stopVictoryFireworks() {
  if (fireworksResizeHandler) {
    window.removeEventListener('resize', fireworksResizeHandler)
    fireworksResizeHandler = null
  }
  clearTimeout(fireworksBurstTimer)
  fireworksBurstTimer = 0
  clearTimeout(fireworksStaggerTimer)
  fireworksStaggerTimer = 0
  cancelAnimationFrame(fireworksRafId)
  fireworksRafId = 0
  fireworksParticles.length = 0
  fireworksBlooms.length = 0
}

function startVictoryFireworks() {
  stopVictoryFireworks()
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  nextTick(() => {
    if (pendingVictoryIndex.value == null) return
    const canvas = fireworksCanvasRef.value
    if (!canvas) return
    resizeVictoryFireworksCanvas()
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.fillStyle = '#0a0908'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    /** 单朵错时燃放、间隔更密，整体烟花更多；偶有短停顿 */
    function scheduleNextBurst() {
      clearTimeout(fireworksBurstTimer)
      const gap =
        Math.random() < 0.08
          ? 850 + Math.floor(Math.random() * 700)
          : 200 + Math.floor(Math.random() * 340)
      fireworksBurstTimer = window.setTimeout(() => {
        if (pendingVictoryIndex.value == null) return
        const { x, y } = randomVictoryBurstPoint()
        spawnVictoryBurst(x, y)
        scheduleNextBurst()
      }, gap)
    }
    const first = randomVictoryBurstPoint()
    spawnVictoryBurst(first.x, first.y)
    fireworksStaggerTimer = window.setTimeout(() => {
      fireworksStaggerTimer = 0
      if (pendingVictoryIndex.value == null) return
      const p = randomVictoryBurstPoint()
      spawnVictoryBurst(p.x, p.y)
    }, 140)
    scheduleNextBurst()

    fireworksResizeHandler = () => {
      if (pendingVictoryIndex.value != null) resizeVictoryFireworksCanvas()
    }
    window.addEventListener('resize', fireworksResizeHandler)

    fireworksRafId = requestAnimationFrame(drawVictoryFireworksFrame)
  })
}

function startCelebration(index) {
  celebrating.value = index
}

function onCardClick(index) {
  if (celebrating.value != null || pendingVictoryIndex.value !== null) return
  enlargedIndex.value = index
}

function closeCardPreview() {
  enlargedIndex.value = null
}

function onPreviewEscape(e) {
  if (e.key !== 'Escape' || enlargedIndex.value == null) return
  e.preventDefault()
  closeCardPreview()
}

async function runCelebrateAnimation(index) {
  await nextTick()
  await nextTick()
  await new Promise((r) => requestAnimationFrame(() => r()))
  let fly = celebrateElRef.value
  if (!fly) {
    await new Promise((r) => requestAnimationFrame(() => r()))
    fly = celebrateElRef.value
  }
  if (!fly) {
    celebrating.value = null
    return
  }

  const stripBtn = collectStripRef.value?.querySelector(
    `.collect-card[data-card-index="${index}"]`,
  )
  const from = stripBtn?.getBoundingClientRect()
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  const maxW = window.innerWidth * 0.92
  const maxH = window.innerHeight * 0.9
  let targetW = Math.min(maxW, 600)
  let targetH = targetW * 1.5
  if (targetH > maxH) {
    targetH = maxH
    targetW = targetH / 1.5
  }
  const okFrom = from && from.width > 4 && from.height > 4
  const scale0 = okFrom ? from.width / targetW : 0.14
  const dx0 = okFrom ? from.left + from.width / 2 - cx : 0
  const dy0 = okFrom ? from.top + from.height / 2 - cy : 0

  fly.style.width = `${targetW}px`
  fly.style.height = `${targetH}px`
  fly.style.aspectRatio = 'auto'
  fly.style.backgroundSize = 'cover'
  fly.style.backgroundPosition = 'center'

  const keyframes = [
    {
      transform: `translate(${dx0}px, ${dy0}px) scale(${scale0}) rotate(0deg)`,
      opacity: 1,
    },
    {
      transform: 'translate(0, 0) scale(1) rotate(360deg)',
      opacity: 1,
      offset: 0.22,
    },
    {
      transform: 'translate(0, 0) scale(1.04) rotate(410deg)',
      opacity: 1,
      offset: 0.38,
    },
    {
      transform: 'translate(0, 0) scale(1) rotate(720deg)',
      opacity: 1,
      offset: 0.58,
    },
    {
      transform: 'translate(0, 0) scale(1) rotate(720deg)',
      opacity: 1,
      offset: 0.72,
    },
    {
      transform: `translate(${dx0}px, ${dy0}px) scale(${scale0}) rotate(780deg)`,
      opacity: 1,
      offset: 1,
    },
  ]

  celebrateAnim?.cancel()
  celebrateAnim = fly.animate(keyframes, {
    duration: 6200,
    easing: 'cubic-bezier(0.45, 0.02, 0.2, 1)',
  })

  try {
    await celebrateAnim.finished
  } catch {
    /* cancelled */
  }
  celebrateAnim = null
  celebrating.value = null
}

watch(
  celebrating,
  (v) => {
    if (v != null) {
      closeCardPreview()
      nextTick(() => runCelebrateAnimation(v))
    }
  },
  { flush: 'post' },
)

watch(pendingVictoryIndex, (v) => {
  if (v != null) {
    window.addEventListener('keydown', onVictoryKeydown)
    startVictoryFireworks()
  } else {
    window.removeEventListener('keydown', onVictoryKeydown)
    stopVictoryFireworks()
  }
})

watch(enlargedIndex, (v) => {
  if (v != null) {
    window.addEventListener('keydown', onPreviewEscape)
  } else {
    window.removeEventListener('keydown', onPreviewEscape)
  }
})

onMounted(() => {
  hydrateGameCollectUnlocked()
  window.addEventListener(MINI_GAME_EXIT_EVENT, onMiniGameExit)
})

onUnmounted(() => {
  window.removeEventListener(MINI_GAME_EXIT_EVENT, onMiniGameExit)
  window.removeEventListener('keydown', onPreviewEscape)
  window.removeEventListener('keydown', onVictoryKeydown)
  stopVictoryFireworks()
  celebrateAnim?.cancel()
})
</script>

<style scoped>
.game-victory-overlay {
  position: fixed;
  inset: 0;
  z-index: 100220;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: clamp(8px, 2vh, 20px);
  padding: max(12px, env(safe-area-inset-top)) 20px max(20px, env(safe-area-inset-bottom));
  box-sizing: border-box;
  pointer-events: auto;
  background: #050403;
}

/* 自下而上：暖黄 → 深褐 → 近黑 */
.game-victory-overlay__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    0deg,
    #e8c56a 0%,
    #c9a227 8%,
    #8b6914 22%,
    #3d2e18 48%,
    #14100c 72%,
    #050403 100%
  );
  pointer-events: none;
}

/* 胜利氛围：底部庆典光、向上放射纹、漂浮光点与彩屑感 */
.game-victory-overlay__festive {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.game-victory-festive__bottom-glow {
  position: absolute;
  bottom: -15%;
  left: 50%;
  transform: translateX(-50%);
  width: 140%;
  height: 55%;
  background: radial-gradient(
    ellipse 55% 45% at 50% 100%,
    rgba(255, 236, 180, 0.55) 0%,
    rgba(255, 200, 90, 0.22) 35%,
    transparent 70%
  );
  mix-blend-mode: screen;
  animation: game-victory-festive-pulse 3.5s ease-in-out infinite;
}

.game-victory-festive__rays {
  position: absolute;
  bottom: -5%;
  left: 50%;
  width: 180%;
  height: 85%;
  transform: translateX(-50%);
  transform-origin: 50% 100%;
  background: repeating-conic-gradient(
    from -4deg at 50% 100%,
    transparent 0deg,
    transparent 7deg,
    rgba(255, 248, 220, 0.045) 7deg,
    rgba(255, 248, 220, 0.045) 7.35deg
  );
  -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, transparent 55%);
  mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, transparent 55%);
  animation: game-victory-festive-rays 48s linear infinite;
  opacity: 0.85;
}

.game-victory-festive__bokeh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle 4px at 12% 78%, rgba(255, 236, 190, 0.95), transparent 100%),
    radial-gradient(circle 3px at 24% 90%, rgba(255, 255, 255, 0.85), transparent 100%),
    radial-gradient(circle 3px at 78% 84%, rgba(255, 210, 120, 0.9), transparent 100%),
    radial-gradient(circle 2px at 90% 92%, rgba(255, 255, 255, 0.75), transparent 100%),
    radial-gradient(circle 3px at 48% 94%, rgba(255, 245, 210, 0.85), transparent 100%),
    radial-gradient(circle 2px at 58% 88%, rgba(255, 200, 100, 0.7), transparent 100%),
    radial-gradient(circle 2px at 34% 96%, rgba(255, 255, 255, 0.65), transparent 100%),
    radial-gradient(circle 3px at 68% 93%, rgba(255, 225, 170, 0.8), transparent 100%);
  mix-blend-mode: screen;
  animation: game-victory-festive-sparkle 2.8s ease-in-out infinite;
}

.game-victory-festive__confetti {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image:
    linear-gradient(105deg, transparent 48%, rgba(255, 200, 80, 0.12) 49%, transparent 52%),
    linear-gradient(72deg, transparent 60%, rgba(255, 240, 200, 0.1) 61%, transparent 64%),
    linear-gradient(15deg, transparent 70%, rgba(200, 160, 255, 0.08) 71%, transparent 74%),
    linear-gradient(-20deg, transparent 55%, rgba(120, 220, 255, 0.07) 56%, transparent 59%);
  background-size:
    120% 100%,
    100% 80%,
    90% 90%,
    110% 110%;
  background-position:
    10% 20%,
    80% 30%,
    50% 15%,
    30% 40%;
  mix-blend-mode: screen;
  animation: game-victory-festive-drift 16s ease-in-out infinite alternate;
}

@keyframes game-victory-festive-pulse {
  0%,
  100% {
    opacity: 0.9;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.03);
  }
}

@keyframes game-victory-festive-rays {
  from {
    transform: translateX(-50%) rotate(0deg);
  }
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

@keyframes game-victory-festive-sparkle {
  0%,
  100% {
    opacity: 0.65;
  }
  50% {
    opacity: 1;
  }
}

@keyframes game-victory-festive-drift {
  0% {
    background-position:
      10% 22%,
      82% 28%,
      48% 18%,
      28% 38%;
  }
  100% {
    background-position:
      14% 18%,
      76% 34%,
      54% 12%,
      34% 44%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .game-victory-festive__bottom-glow,
  .game-victory-festive__bokeh {
    animation: none;
  }

  .game-victory-festive__rays {
    animation: none;
  }

  .game-victory-festive__confetti {
    animation: none;
  }
}

/* 写实风烟花：全屏 Canvas（金白细线 + 爆心高光）；暖色衬夜天 */
.game-victory-overlay__fireworks {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.game-victory-fire-warm {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 110% 58% at 50% 0%, rgba(95, 75, 45, 0.42) 0%, transparent 50%),
    radial-gradient(ellipse 70% 42% at 22% 18%, rgba(130, 100, 55, 0.22) 0%, transparent 48%),
    radial-gradient(ellipse 70% 42% at 78% 14%, rgba(110, 85, 50, 0.2) 0%, transparent 48%);
  mix-blend-mode: screen;
  opacity: 0.72;
  pointer-events: none;
}

.game-victory-overlay__fireworks-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
}

@media (prefers-reduced-motion: reduce) {
  .game-victory-overlay__fireworks-canvas {
    opacity: 0;
    visibility: hidden;
  }

  .game-victory-fire-warm {
    opacity: 0.28;
  }
}

.game-victory-overlay__title {
  position: relative;
  z-index: 2;
  margin: 0;
  padding: 0 12px;
  text-align: center;
  font-size: clamp(1.58rem, 5.1vw + 0.72rem, 2.58rem);
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.35;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'STKaiti', 'KaiTi', serif;
  background: linear-gradient(
    180deg,
    #fffef8 0%,
    #f0e6c8 28%,
    #d4af37 52%,
    #c9a227 72%,
    #a67c00 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 24px rgba(212, 175, 55, 0.25));
}

.game-victory-overlay__main {
  position: relative;
  z-index: 2;
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: clamp(16px, 4vw, 40px);
  width: 100%;
  max-width: min(1040px, 100%);
  min-height: 0;
}

.game-victory-overlay__right {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: min(92vw, 760px);
}

/* 卡牌与介绍左右并排：介绍在卡牌右侧 */
.game-victory-overlay__card-info-row {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  gap: clamp(14px, 2.8vw, 28px);
  width: 100%;
  min-width: 0;
}

.game-victory-overlay__card-wrap {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 14px;
  overflow: hidden;
  border: 3px solid rgba(201, 162, 39, 0.88);
  box-shadow:
    0 0 48px rgba(212, 175, 55, 0.22),
    0 18px 52px rgba(0, 0, 0, 0.55),
    inset 0 0 0 1px rgba(255, 248, 220, 0.12);
  background: radial-gradient(ellipse at 50% 30%, rgba(45, 38, 28, 0.95) 0%, #14100c 72%);
  width: min(36vw, 300px);
  max-width: min(36vw, 300px);
  max-height: min(72vh, 560px);
}

.game-victory-overlay__card-img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: min(68vh, 520px);
  object-fit: contain;
  object-position: center center;
}

.game-victory-overlay__info {
  flex: 1 1 200px;
  min-width: min(42vw, 240px);
  max-width: min(46vw, 340px);
  align-self: center;
  padding: 16px 18px 18px;
  border-radius: 12px;
  background: linear-gradient(
    145deg,
    rgba(36, 30, 24, 0.94) 0%,
    rgba(18, 14, 10, 0.97) 100%
  );
  border: 1px solid rgba(180, 145, 60, 0.38);
  box-shadow:
    inset 0 1px 0 rgba(255, 248, 220, 0.06),
    0 8px 32px rgba(0, 0, 0, 0.35);
}

.game-victory-overlay__building-name {
  margin: 0 0 12px;
  font-size: clamp(1.05rem, 2.2vw + 0.5rem, 1.45rem);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(255, 248, 235, 0.96);
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'STKaiti', serif;
  border-bottom: 1px solid rgba(180, 145, 60, 0.28);
  padding-bottom: 10px;
}

.game-victory-overlay__era,
.game-victory-overlay__features {
  margin: 0 0 10px;
  font-size: 0.82rem;
  line-height: 1.55;
  color: rgba(220, 205, 180, 0.88);
}

.game-victory-overlay__features {
  margin-bottom: 0;
}

.game-victory-overlay__label {
  display: block;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  color: rgba(212, 175, 55, 0.75);
  margin-bottom: 4px;
}

.game-victory-overlay__value {
  display: block;
  letter-spacing: 0.04em;
}

.game-victory-overlay__cta {
  position: relative;
  z-index: 3;
  flex-shrink: 0;
  margin: 0;
  padding: 12px 36px;
  border-radius: 10px;
  border: 2px solid rgba(212, 175, 55, 0.75);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  cursor: pointer;
  color: #2a1f14;
  background: linear-gradient(180deg, #faf3e0 0%, #e8d4a8 40%, #c9a227 100%);
  box-shadow:
    0 0 28px rgba(212, 175, 55, 0.35),
    0 8px 24px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.game-victory-overlay__cta:hover {
  filter: brightness(1.06);
}

.game-victory-fade-enter-active,
.game-victory-fade-leave-active {
  transition: opacity 0.28s ease;
}

.game-victory-fade-enter-from,
.game-victory-fade-leave-to {
  opacity: 0;
}

@media (max-width: 720px) {
  .game-victory-overlay__main {
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .game-victory-overlay__right {
    max-width: 100%;
  }

  .game-victory-overlay__card-info-row {
    flex-direction: column;
    align-items: center;
  }

  .game-victory-overlay__card-wrap {
    width: min(78vw, 280px);
    max-width: min(78vw, 280px);
    max-height: min(50vh, 420px);
  }

  .game-victory-overlay__card-img {
    max-height: min(46vh, 400px);
  }

  .game-victory-overlay__info {
    flex: 1 1 auto;
    min-width: 0;
    max-width: 100%;
    width: 100%;
  }
}

.collect-luxe {
  position: fixed;
  z-index: 100150;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 12px max(10px, env(safe-area-inset-bottom, 0px));
  pointer-events: none;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.collect-luxe__trap {
  pointer-events: auto;
  width: min(960px, 100%);
  filter: drop-shadow(0 -6px 24px rgba(0, 0, 0, 0.45));
}

.collect-luxe__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
  padding: 12px 22px 14px;
  background: linear-gradient(
    180deg,
    rgba(32, 26, 20, 0.92) 0%,
    rgba(16, 13, 10, 0.96) 100%
  );
  border: 1px solid rgba(180, 145, 60, 0.35);
  border-bottom: none;
  border-radius: 14px 14px 0 0;
  clip-path: polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 248, 220, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.4);
}

.collect-luxe__count {
  flex: 0 0 auto;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(255, 252, 245, 0.9);
  white-space: nowrap;
}

.collect-luxe__slots {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  min-width: 0;
}

.collect-luxe__cta {
  flex: 0 0 auto;
  margin: 0;
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid rgba(100, 80, 40, 0.6);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  cursor: not-allowed;
  color: rgba(80, 72, 60, 0.85);
  background: linear-gradient(180deg, rgba(55, 48, 40, 0.9), rgba(35, 30, 26, 0.95));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition:
    color 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    transform 0.2s ease;
}

.collect-luxe__cta--active {
  cursor: default;
  color: #2a1f14;
  border-color: rgba(212, 175, 55, 0.75);
  background: linear-gradient(180deg, #f5ecd8 0%, #e8d4a8 35%, #c9a227 100%);
  box-shadow:
    0 0 20px rgba(212, 175, 55, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.collect-luxe__cta--active:not(:disabled) {
  cursor: pointer;
}

.collect-luxe__cta--active:hover {
  transform: translateY(-1px);
}

@media (max-width: 720px) {
  .collect-luxe__row {
    flex-direction: column;
    align-items: stretch;
    clip-path: polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%);
    padding: 12px 16px;
  }

  .collect-luxe__slots {
    justify-content: center;
  }

  .collect-luxe__cta {
    width: 100%;
    padding: 10px 16px;
  }
}

.collect-card {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 68px;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.collect-card--bar {
  width: 56px;
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.collect-card:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.38);
}

.collect-card--unlocked:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
}

.collect-card__inner {
  display: block;
  aspect-ratio: 2 / 3;
  width: 100%;
  border-radius: 7px;
  border: 2px solid rgba(201, 162, 39, 0.65);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background: #1a1512;
  box-shadow:
    inset 0 0 0 1px rgba(255, 240, 210, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.35);
}

.collect-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  display: block;
}

.collect-card--locked .collect-card__img {
  filter: brightness(0.38) saturate(0.45) contrast(1.05);
}

.collect-card--unlocked .collect-card__inner {
  border-color: rgba(232, 200, 120, 0.9);
}

.collect-celebrate {
  position: fixed;
  inset: 0;
  z-index: 100200;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background: rgba(4, 6, 10, 0.58);
  perspective: 1400px;
}

.collect-celebrate__card {
  position: relative;
  border-radius: 12px;
  border: 3px solid rgba(201, 162, 39, 0.85);
  box-shadow:
    0 0 60px rgba(255, 200, 120, 0.22),
    0 24px 80px rgba(0, 0, 0, 0.55);
  transform-origin: center center;
  will-change: transform;
  overflow: hidden;
  background-color: #1a1512;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.collect-celebrate__title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 12px 10px 14px;
  font-size: clamp(0.95rem, 3.2vw, 1.35rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-align: center;
  color: rgba(255, 248, 235, 0.98);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.75);
  font-family: 'STKaiti', 'KaiTi', 'PingFang SC', 'Microsoft YaHei', serif;
  background: linear-gradient(transparent, rgba(25, 18, 12, 0.88));
}

.collect-preview {
  position: fixed;
  inset: 0;
  z-index: 100180;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(20px, env(safe-area-inset-top)) 20px 24px;
  box-sizing: border-box;
  background: rgba(4, 8, 14, 0.62);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: auto;
}

.collect-preview__panel {
  position: relative;
  width: min(420px, 88vw);
  max-height: min(88vh, 720px);
}

.collect-preview__close {
  position: absolute;
  top: -6px;
  right: -6px;
  z-index: 2;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  border: 2px solid rgba(255, 230, 200, 0.75);
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(45, 32, 22, 0.96), rgba(24, 18, 12, 0.98));
  color: #f5e6c8;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.collect-preview__close:hover {
  filter: brightness(1.12);
}

.collect-preview__card {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 14px;
  border: 3px solid rgba(201, 162, 39, 0.88);
  box-shadow:
    0 0 48px rgba(255, 200, 120, 0.2),
    0 20px 56px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  position: relative;
  background: #1a1512;
}

.collect-preview__card--locked .collect-preview__img {
  filter: brightness(0.38) saturate(0.42) contrast(1.05);
}

.collect-preview__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  display: block;
}

.collect-preview__title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 14px 12px 16px;
  font-size: clamp(1rem, 3.5vw, 1.4rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-align: center;
  color: rgba(255, 248, 235, 0.98);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
  font-family: 'STKaiti', 'KaiTi', 'PingFang SC', 'Microsoft YaHei', serif;
  background: linear-gradient(transparent, rgba(25, 18, 12, 0.9));
}

.collect-preview-enter-active,
.collect-preview-leave-active {
  transition: opacity 0.22s ease;
}

.collect-preview-enter-active .collect-preview__panel,
.collect-preview-leave-active .collect-preview__panel {
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.collect-preview-enter-from,
.collect-preview-leave-to {
  opacity: 0;
}

.collect-preview-enter-from .collect-preview__panel,
.collect-preview-leave-to .collect-preview__panel {
  transform: scale(0.88);
}
</style>
