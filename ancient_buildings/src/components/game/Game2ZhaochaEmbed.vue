<template>
  <div
    ref="embedRootRef"
    class="g2z-embed"
    :class="{
      'g2z-embed--trio-slot': compactSlot && !immersiveMode,
      'g2z-embed--immersive': immersiveMode,
    }"
    :style="{ '--g2z-bg-image': g2zBackgroundImage }"
    aria-label="大明总造办：规划与营缮"
  >
    <div class="g2z-embed__frame-wrap">
      <div
        ref="scaleHostRef"
        class="g2z-embed__scale-host"
        :class="{ 'g2z-embed__scale-host--trio': useTrioScaleLayout }"
      >
        <div class="g2z-embed__scale-inner" :style="trioInnerStyle">
          <iframe
            class="g2z-embed__frame"
            :src="iframeSrc"
            title="大明总造办：规划与营缮"
            allow="fullscreen"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      <button
        v-if="showLaunchLayer"
        type="button"
        class="g2z-embed__launch"
        @click="enterImmersiveMode"
      >
        <span class="g2z-embed__launch-icon" aria-hidden="true">⛶</span>
        <span class="g2z-embed__launch-text">点击进入游戏</span>
        <span class="g2z-embed__launch-hint">全屏开始游玩</span>
      </button>
      <button
        v-if="compactSlot && !immersiveMode"
        type="button"
        class="g2z-embed__compact-end"
        @click="signalGame2SessionEnded"
      >
        结束游戏
      </button>
    </div>
    <div v-if="immersiveMode" class="g2z-embed__exit-host" aria-hidden="false">
      <button type="button" class="g2z-embed__exit-game" @click="exitImmersiveMode">
        退出游戏
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick, watchEffect } from 'vue'

/** 与游戏页大致版心一致，用于三列槽位内等比缩小以铺满可视区域 */
const TRIO_BASE_W = 1024
const TRIO_BASE_H = 780

const props = defineProps({
  compactSlot: { type: Boolean, default: false },
})

/** 与同目录 games/game2/ph.jpg（源：ancient_buildings/game2/ph.jpg） */
const g2zBackgroundImage = computed(() => {
  const base = import.meta.env.BASE_URL || '/'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `url('${normalized}games/game2/ph.jpg')`
})

const embedRootRef = ref(null)
const scaleHostRef = ref(null)
const immersiveMode = ref(false)
const trioScale = ref(0.45)

const useTrioScaleLayout = computed(
  () => props.compactSlot && !immersiveMode.value,
)

const trioInnerStyle = computed(() => {
  if (!useTrioScaleLayout.value) return {}
  const s = trioScale.value
  return {
    width: `${TRIO_BASE_W}px`,
    height: `${TRIO_BASE_H}px`,
    transform: `translate(-50%, -50%) scale(${s})`,
  }
})

function updateTrioScale() {
  const host = scaleHostRef.value
  if (!host || !props.compactSlot || immersiveMode.value) return
  const rw = host.clientWidth
  const rh = host.clientHeight
  if (rw < 2 || rh < 2) return
  trioScale.value = Math.min(rw / TRIO_BASE_W, rh / TRIO_BASE_H)
}

watchEffect((onCleanup) => {
  if (!useTrioScaleLayout.value) return
  const host = scaleHostRef.value
  if (!host) return
  const ro = new ResizeObserver(() => updateTrioScale())
  ro.observe(host)
  updateTrioScale()
  onCleanup(() => ro.disconnect())
})

const iframeSrc = computed(() => {
  const base = import.meta.env.BASE_URL || '/'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}games/game2/index.html`
})

const showLaunchLayer = computed(() => props.compactSlot && !immersiveMode.value)

function requestContainerFullscreen(el) {
  if (!el) return Promise.resolve()
  const req =
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen
  if (req) {
    return Promise.resolve(req.call(el)).catch(() => {})
  }
  return Promise.resolve()
}

function getFullscreenElement() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    null
  )
}

function exitBrowserFullscreen() {
  if (getFullscreenElement()) {
    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen
    if (exit) return Promise.resolve(exit.call(document)).catch(() => {})
  }
  return Promise.resolve()
}

async function enterImmersiveMode() {
  immersiveMode.value = true
  await nextTick()
  const el = embedRootRef.value
  await requestContainerFullscreen(el)
}

/** 与 GameCollectibleCards 约定：小游戏三 → slot 3 → 第三张卡 */
const MINI_GAME_SLOT_GAME2 = 3
let lastExitSignal = 0
function signalGame2SessionEnded() {
  const t = Date.now()
  if (t - lastExitSignal < 450) return
  lastExitSignal = t
  window.dispatchEvent(
    new CustomEvent('ancient-buildings-mini-game-exit', {
      detail: { gameSlot: MINI_GAME_SLOT_GAME2 },
    }),
  )
}

async function exitImmersiveMode() {
  await exitBrowserFullscreen()
  if (immersiveMode.value) {
    immersiveMode.value = false
    signalGame2SessionEnded()
  }
}

function onFullscreenChange() {
  const el = embedRootRef.value
  const fs = getFullscreenElement()
  if (!fs && immersiveMode.value) {
    immersiveMode.value = false
    signalGame2SessionEnded()
  } else if (el && fs === el && !immersiveMode.value) {
    immersiveMode.value = true
  }
}

function onKeydownEscape(e) {
  if (e.key !== 'Escape' || !immersiveMode.value) return
  e.preventDefault()
  exitImmersiveMode()
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('webkitfullscreenchange', onFullscreenChange)
  document.addEventListener('mozfullscreenchange', onFullscreenChange)
  document.addEventListener('MSFullscreenChange', onFullscreenChange)
  window.addEventListener('keydown', onKeydownEscape)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
  document.removeEventListener('mozfullscreenchange', onFullscreenChange)
  document.removeEventListener('MSFullscreenChange', onFullscreenChange)
  window.removeEventListener('keydown', onKeydownEscape)
  const fs = getFullscreenElement()
  if (fs && embedRootRef.value && fs === embedRootRef.value) {
    exitBrowserFullscreen()
  }
  immersiveMode.value = false
})
</script>

<style scoped>
.g2z-embed {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  min-height: min(72vh, 640px);
  border-radius: 14px;
  overflow: hidden;
  background-color: #2b1d14;
  background-image: linear-gradient(
      165deg,
      rgba(43, 29, 20, 0.48) 0%,
      rgba(22, 16, 12, 0.55) 100%
    ),
    var(--g2z-bg-image);
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
  box-shadow: 0 12px 40px rgba(15, 18, 28, 0.35);
  box-sizing: border-box;
  isolation: isolate;
}

.g2z-embed--immersive {
  position: fixed;
  inset: 0;
  z-index: 99980;
  width: 100vw !important;
  width: 100dvw !important;
  height: 100vh !important;
  height: 100dvh !important;
  max-width: none !important;
  max-height: none !important;
  min-height: 0 !important;
  border-radius: 0;
  margin: 0;
  box-shadow: none;
}

.g2z-embed--immersive .g2z-embed__frame-wrap {
  flex: 1;
  min-height: 0;
  height: 100%;
}

.g2z-embed--trio-slot {
  flex: 0 0 auto;
  align-self: stretch;
  width: 100%;
  max-width: 100%;
  height: var(--game-trio-screen-h, min(40vh, 420px));
  min-height: var(--game-trio-screen-h, min(40vh, 420px));
  max-height: var(--game-trio-screen-h, min(40vh, 420px));
}

.g2z-embed--trio-slot .g2z-embed__frame-wrap {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.g2z-embed--trio-slot .g2z-embed__scale-host {
  min-height: 0;
}

.g2z-embed--immersive .g2z-embed__scale-host {
  flex: 1;
  min-height: 0;
  height: 100%;
}

.g2z-embed--immersive .g2z-embed__scale-inner {
  width: 100%;
  height: 100%;
}

.g2z-embed--immersive .g2z-embed__frame {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.g2z-embed__frame-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 360px;
  overflow: hidden;
}

.g2z-embed--trio-slot .g2z-embed__frame-wrap {
  min-height: 0;
}

.g2z-embed__scale-host {
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}

.g2z-embed__scale-host--trio .g2z-embed__scale-inner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center center;
  box-sizing: border-box;
}

.g2z-embed__scale-inner {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.g2z-embed__frame {
  display: block;
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 360px;
  border: 0;
  background: rgba(30, 22, 16, 0.35);
}

.g2z-embed--trio-slot .g2z-embed__frame {
  min-height: 0;
}

.g2z-embed__launch {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0;
  padding: 16px;
  border: none;
  cursor: pointer;
  font-family: 'STKaiti', 'KaiTi', 'PingFang SC', 'Microsoft YaHei', serif;
  background: linear-gradient(
    165deg,
    rgba(43, 29, 20, 0.38) 0%,
    rgba(22, 16, 12, 0.48) 100%
  );
  color: #f4e8d3;
  transition: background 0.2s ease, transform 0.2s ease;
}

.g2z-embed__launch:hover {
  background: linear-gradient(
    165deg,
    rgba(58, 42, 30, 0.48) 0%,
    rgba(30, 22, 16, 0.58) 100%
  );
}

.g2z-embed__launch:focus {
  outline: none;
}

.g2z-embed__launch:focus-visible {
  outline: 2px solid rgba(212, 165, 116, 0.9);
  outline-offset: -4px;
}

.g2z-embed__launch-icon {
  font-size: 1.65rem;
  line-height: 1;
  opacity: 0.95;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}

.g2z-embed__launch-text {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
}

.g2z-embed__launch-hint {
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(244, 232, 211, 0.72);
}

.g2z-embed__compact-end {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  margin: 0;
  padding: 5px 14px;
  border: 1px solid rgba(212, 165, 116, 0.55);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(52, 40, 30, 0.96), rgba(28, 22, 16, 0.98));
  color: #f4e8d3;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  font-family: 'STKaiti', 'KaiTi', 'PingFang SC', 'Microsoft YaHei', serif;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.g2z-embed__compact-end:hover {
  filter: brightness(1.08);
}

.g2z-embed__exit-host {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: calc(12px + env(safe-area-inset-top, 0px)) calc(12px + env(safe-area-inset-right, 0px)) 0
    16px;
  pointer-events: none;
}

.g2z-embed__exit-game {
  pointer-events: auto;
  padding: 10px 22px;
  border: 2px solid rgba(201, 162, 39, 0.88);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(52, 38, 26, 0.95), rgba(32, 24, 16, 0.97));
  color: #f5e6c8;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  font-family: 'STKaiti', 'KaiTi', 'PingFang SC', 'Microsoft YaHei', serif;
  cursor: pointer;
  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.g2z-embed__exit-game:hover {
  transform: translateY(-1px);
  border-color: rgba(232, 200, 120, 0.95);
  box-shadow:
    0 6px 22px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.g2z-embed__exit-game:focus {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(201, 162, 39, 0.45),
    0 4px 18px rgba(0, 0, 0, 0.45);
}
</style>
