<template>
  <!-- 嵌入仓库 game/fuzhou-ancient-house-restorer-main（Django）提供的 Web 游戏 -->
  <div
    id="game-container"
    ref="embedRootRef"
    class="hzh-embed"
    :class="{
      'hzh-embed--immersive': immersiveMode,
      'hzh-embed--trio-slot': compactSlot,
    }"
    aria-label="徽州古建筑修复师游戏区域"
  >
    <template v-if="iframeSrc">
      <div class="hzh-embed__frame-wrap">
      <iframe
        :key="iframeKey"
        class="hzh-embed__frame"
        :class="{ 'hzh-embed__frame--dim': showConnectionOverlay }"
        :src="iframeSrc"
        title="重生之我是徽州古建筑修复师"
        allow="autoplay; fullscreen; clipboard-write"
        referrerpolicy="no-referrer-when-downgrade"
        @load="onIframeLoad"
      />
      <div v-if="showConnectionOverlay" class="hzh-embed__overlay" role="alert">
        <p class="hzh-embed__overlay-title">
          {{ isConnecting ? '正在连接游戏服务器...' : '长时间未能打开游戏页面' }}
        </p>
        <p v-if="!isConnecting" class="hzh-embed__overlay-text">
          <template v-if="isDev && iframeSrc.includes('127.0.0.1')">
            小游戏来自本机 Django。推荐在项目根目录运行 <code>start.bat</code> 一键启动；或手动执行：
            <code>cd game/fuzhou-ancient-house-restorer-main/Game</code> →
            <code>python manage.py runserver 8000</code>
            ，再刷新本页。未启动时会出现「拒绝连接」。
          </template>
          <template v-else>
            请先启动 Django：可在项目根目录执行 <code>start.bat</code>，或在
            <code>game/fuzhou-ancient-house-restorer-main/Game</code> 目录执行
            <code>python manage.py runserver 8000</code>。保持终端窗口不要关，系统会自动尝试连接。
          </template>
        </p>
        <p v-if="!isConnecting && !isDev" class="hzh-embed__overlay-text">
          若使用 <code>npm run build</code> 或 <code>vite preview</code>，请在 <code>.env</code> 中设置
          <code>VITE_HUIZHOU_GAME_URL=http://127.0.0.1:8000</code> 后重新构建。
        </p>
        <button v-if="!isConnecting" type="button" class="hzh-embed__retry" @click="retryIframe">重试加载</button>
      </div>
      <button
        v-if="showLaunchLayer && !showConnectionOverlay"
        type="button"
        class="hzh-embed__launch"
        @click="enterImmersiveMode"
      >
        <span class="hzh-embed__launch-icon" aria-hidden="true">🏯</span>
        <span class="hzh-embed__launch-text">点击进入游戏</span>
        <span class="hzh-embed__launch-hint">全屏开始游玩</span>
      </button>
      </div>
      <!-- 必须挂在 #game-container 下，浏览器全屏时才在同一棵子树内可见 -->
      <div v-if="immersiveMode" class="hzh-embed__exit-host" aria-hidden="false">
        <button type="button" class="hzh-embed__exit-game" @click="exitImmersiveMode">
          退出游戏
        </button>
      </div>
      <button
        v-if="compactSlot && !immersiveMode"
        type="button"
        class="hzh-embed__compact-end"
        @click="onCompactSessionEnd"
      >
        结束游戏
      </button>
    </template>
    <div v-else class="hzh-embed__notice">
      <h3 class="hzh-embed__notice-title">徽州古建筑修复师（完整版）</h3>
      <p v-if="embedDisabled" class="hzh-embed__notice-lead">已关闭 iframe 嵌入（<code>VITE_HUIZHOU_GAME_URL=false</code>）。</p>
      <p v-else-if="!isDev" class="hzh-embed__notice-lead hzh-embed__notice-lead--warn">
        <strong>生产/预览模式未配置游戏地址：</strong>执行 <code>npm run build</code> 或 <code>vite preview</code> 时，必须在环境变量中设置
        <code>VITE_HUIZHOU_GAME_URL</code>（例如 <code>http://127.0.0.1:8000</code>），否则不会加载 iframe。
      </p>
      <p class="hzh-embed__notice-text">
        该游戏源码位于项目目录 <code>game/fuzhou-ancient-house-restorer-main</code>，由 Django 渲染页面并提供进度接口；静态素材需放在与
        <code>Game/config/settings.py</code> 中 <code>STATICFILES_DIRS</code> 一致的资源目录（默认仓库外层的
        <code>Assets</code> 文件夹）。
      </p>
      <p class="hzh-embed__notice-text">
        本地运行：建议在项目根目录执行 <code>start.bat</code> 一键启动前后端；若手动启动，则在
        <code>game/.../Game</code> 下执行 <code>python manage.py runserver 8000</code>。开发模式下本站会默认请求
        <code>http://127.0.0.1:8000/start/</code>；生产环境请设置 <code>VITE_HUIZHOU_GAME_URL</code> 为实际游戏根地址后重新构建。
      </p>
      <p class="hzh-embed__notice-hint">
        后端已允许被本站页面用 iframe 嵌入。开发环境若要关闭自动加载，可设 <code>VITE_HUIZHOU_GAME_URL=false</code>。
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  /** 三列并排时收窄高度与最小尺寸，宽度由父级栅格控制（约整行 1/3） */
  compactSlot: { type: Boolean, default: false },
})

const isDev = import.meta.env.DEV

/** Chrome 在「拒绝连接」时仍会对 iframe 触发 load，不能单靠 @load 判断成功 */

/**
 * 必须使用 Django 根路径（含端口），以便模板内 /main/、/static/ 等绝对路径在 iframe 内正确解析。
 * 勿使用 Vite 子路径代理，否则点击「开始」会跳到本站 /main/ 而非后端。
 */
const rawGameUrl = import.meta.env.VITE_HUIZHOU_GAME_URL

const embedDisabled = computed(() => rawGameUrl === 'false' || rawGameUrl === '0')

function startPageUrlWithEmbed(gameRoot) {
  const root = gameRoot.trim().replace(/\/$/, '')
  const path = `${root}/start/`
  try {
    const u = new URL(path)
    u.searchParams.set('embed', '1')
    return u.href
  } catch {
    return path.includes('?') ? `${path}&embed=1` : `${path}?embed=1`
  }
}

const iframeSrc = computed(() => {
  if (embedDisabled.value) return ''
  if (typeof rawGameUrl === 'string' && rawGameUrl.trim().length > 0) {
    return startPageUrlWithEmbed(rawGameUrl)
  }
  if (isDev) return startPageUrlWithEmbed('http://127.0.0.1:8000')
  return ''
})

const embedRootRef = ref(null)
const iframeKey = ref(0)
const immersiveMode = ref(false)
const loadTimedOut = ref(false)
const isConnecting = ref(false)
let loadTimer = null
let reconnectTimer = null

const showConnectionOverlay = computed(() => loadTimedOut.value)

const showLaunchLayer = computed(() => props.compactSlot && !immersiveMode.value)

function clearLoadTimer() {
  if (loadTimer != null) {
    clearTimeout(loadTimer)
    loadTimer = null
  }
}

function scheduleLoadTimeout() {
  clearLoadTimer()
  // 备用：iframe 长时间不触发 load 时提示（与「拒绝连接仍触发 load」无关）
  loadTimer = window.setTimeout(() => {
    loadTimedOut.value = true
    loadTimer = null
  }, 40000)
}

/** Chrome 在连接被拒绝时仍可能对 iframe 触发 load，不能在此处把 loadTimedOut 置为 false */
function onIframeLoad() {
  clearLoadTimer()
}

function retryIframe() {
  loadTimedOut.value = false
  iframeKey.value += 1
  if (iframeSrc.value) {
    scheduleLoadTimeout()
    checkServerStatus()
  }
}

/** 用 fetch 判断 Django 是否可达；no-cors 在拒绝连接时会走 catch，成功则 resolve（opaque） */
function checkServerStatus() {
  if (!iframeSrc.value || embedDisabled.value) return

  isConnecting.value = true

  fetch(iframeSrc.value, {
    method: 'GET',
    mode: 'no-cors',
  })
    .then(() => {
      isConnecting.value = false
      clearReconnectTimer()
      const wasDown = loadTimedOut.value
      loadTimedOut.value = false
      clearLoadTimer()
      if (wasDown) iframeKey.value += 1
    })
    .catch(() => {
      isConnecting.value = false
      clearLoadTimer()
      loadTimedOut.value = true
      clearReconnectTimer()
      reconnectTimer = window.setTimeout(checkServerStatus, 2000)
    })
}

// 清除重连定时器
function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}

watch(
  () => iframeSrc.value,
  (src) => {
    loadTimedOut.value = false
    clearReconnectTimer()
    if (!src) {
      clearLoadTimer()
      return
    }
    scheduleLoadTimeout()
    checkServerStatus()
  },
  { immediate: true },
)

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

const MINI_GAME_SLOT_HUIZHOU = 1
let lastHuizhouExitSignal = 0
function signalHuizhouSessionEnded() {
  const t = Date.now()
  if (t - lastHuizhouExitSignal < 450) return
  lastHuizhouExitSignal = t
  window.dispatchEvent(
    new CustomEvent('ancient-buildings-mini-game-exit', {
      detail: { gameSlot: MINI_GAME_SLOT_HUIZHOU },
    }),
  )
}

function onCompactSessionEnd() {
  signalHuizhouSessionEnded()
}

async function exitImmersiveMode() {
  await exitBrowserFullscreen()
  if (immersiveMode.value) {
    immersiveMode.value = false
    signalHuizhouSessionEnded()
  }
}

function onFullscreenChange() {
  const el = embedRootRef.value
  const fs = getFullscreenElement()
  if (!fs && immersiveMode.value) {
    immersiveMode.value = false
    signalHuizhouSessionEnded()
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
  clearLoadTimer()
  clearReconnectTimer()
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
  document.removeEventListener('mozfullscreenchange', onFullscreenChange)
  document.removeEventListener('MSFullscreenChange', onFullscreenChange)
  window.removeEventListener('keydown', onKeydownEscape)
  exitBrowserFullscreen()
  immersiveMode.value = false
})
</script>

<style scoped>
#game-container.hzh-embed {
  isolation: isolate;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: min(72vh, 640px);
  border-radius: 14px;
  overflow: hidden;
  background: #1e2329;
  box-shadow: 0 12px 40px rgba(15, 18, 28, 0.35);
  box-sizing: border-box;
}

/* 嵌入全屏：占满视口（浏览器全屏成功时由系统处理边距；失败时仍铺满可视区域） */
#game-container.hzh-embed.hzh-embed--immersive {
  position: fixed;
  inset: 0;
  z-index: 99980;
  width: 100vw;
  width: 100dvw;
  height: 100vh;
  height: 100dvh;
  max-width: none;
  min-height: 0;
  border-radius: 0;
  margin: 0;
  box-shadow: none;
}

#game-container.hzh-embed.hzh-embed--immersive .hzh-embed__frame-wrap {
  height: 100%;
  min-height: 0;
  flex: 1;
}

#game-container.hzh-embed.hzh-embed--immersive .hzh-embed__frame {
  min-height: 0;
  height: 100%;
}

/* 与其它小游戏槽同宽（约 1/3 行宽），高度与 MapView --game-trio-screen-h 一致 */
#game-container.hzh-embed.hzh-embed--trio-slot {
  position: relative;
  flex: 0 0 auto;
  width: 100%;
  max-width: 100%;
  min-height: var(--game-trio-screen-h, min(40vh, 420px));
  height: var(--game-trio-screen-h, min(40vh, 420px));
  max-height: var(--game-trio-screen-h, min(40vh, 420px));
}

.hzh-embed__compact-end {
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 6;
  margin: 0;
  padding: 6px 12px;
  border: 1px solid rgba(255, 210, 160, 0.45);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(55, 42, 32, 0.95), rgba(32, 26, 20, 0.98));
  color: #f5e6c8;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  font-family: 'STKaiti', 'KaiTi', 'PingFang SC', 'Microsoft YaHei', serif;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.hzh-embed__compact-end:hover {
  filter: brightness(1.08);
}

#game-container.hzh-embed.hzh-embed--trio-slot .hzh-embed__frame-wrap {
  flex: 1;
  min-height: 0;
  height: 100%;
  max-height: none;
}

#game-container.hzh-embed.hzh-embed--trio-slot .hzh-embed__frame {
  min-height: 0;
  flex: 1;
  height: 100%;
}

#game-container.hzh-embed.hzh-embed--trio-slot.hzh-embed--immersive {
  flex: none;
  height: 100vh;
  height: 100dvh;
}

#game-container.hzh-embed *,
#game-container.hzh-embed *::before,
#game-container.hzh-embed *::after {
  box-sizing: border-box;
}

.hzh-embed__probing {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgba(232, 228, 220, 0.85);
  background: rgba(18, 20, 26, 0.72);
  pointer-events: none;
}

.hzh-embed__frame-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 480px;
  height: clamp(420px, 62vh, 720px);
}

.hzh-embed__frame {
  display: block;
  width: 100%;
  flex: 1;
  min-height: 360px;
  border: 0;
  background: #1e2329;
  transition: filter 0.3s ease;
}

.hzh-embed__frame--dim {
  filter: brightness(0.35);
}

.hzh-embed__overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  text-align: center;
  background: rgba(12, 14, 18, 0.82);
  color: #e8e4dc;
  font-family: system-ui, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  line-height: 1.55;
}

.hzh-embed__overlay-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #f5d4a8;
}

.hzh-embed__overlay-text {
  margin: 0;
  max-width: 36em;
  color: rgba(232, 228, 220, 0.9);
}

.hzh-embed__overlay-text code {
  font-size: 0.88em;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.hzh-embed__retry {
  margin-top: 8px;
  padding: 8px 20px;
  border: 1px solid rgba(201, 162, 39, 0.6);
  border-radius: 999px;
  background: rgba(201, 162, 39, 0.2);
  color: #f5e6c8;
  font-size: 0.9rem;
  cursor: pointer;
}

.hzh-embed__retry:hover {
  background: rgba(201, 162, 39, 0.35);
}

.hzh-embed__launch {
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
    rgba(42, 34, 24, 0.72) 0%,
    rgba(22, 18, 14, 0.82) 100%
  );
  color: #f4e8d3;
  transition: background 0.2s ease, transform 0.2s ease;
}

.hzh-embed__launch:hover {
  background: linear-gradient(
    165deg,
    rgba(58, 46, 34, 0.82) 0%,
    rgba(30, 24, 18, 0.9) 100%
  );
}

.hzh-embed__launch:focus {
  outline: none;
}

.hzh-embed__launch:focus-visible {
  outline: 2px solid rgba(212, 165, 90, 0.9);
  outline-offset: -4px;
}

.hzh-embed__launch-icon {
  font-size: 1.65rem;
  line-height: 1;
  opacity: 0.95;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}

.hzh-embed__launch-text {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
}

.hzh-embed__launch-hint {
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(244, 232, 211, 0.72);
}

.hzh-embed__notice {
  padding: 20px 22px 24px;
  color: #e8e4dc;
  font-family: system-ui, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

.hzh-embed__notice-title {
  margin: 0 0 12px;
  font-size: 1.15rem;
  font-weight: 600;
  color: #f5f0e6;
}

.hzh-embed__notice-lead {
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(232, 228, 220, 0.92);
}

.hzh-embed__notice-lead--warn {
  background: rgba(180, 90, 60, 0.25);
  border: 1px solid rgba(255, 160, 120, 0.35);
}

.hzh-embed__notice-text {
  margin: 0 0 12px;
  color: rgba(232, 228, 220, 0.88);
}

.hzh-embed__notice-text code,
.hzh-embed__notice-hint code,
.hzh-embed__notice-lead code {
  font-size: 0.88em;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
}

.hzh-embed__notice-hint {
  margin: 0;
  font-size: 13px;
  color: rgba(232, 228, 220, 0.55);
}

/* 叠在 iframe 之上；与 #game-container 一同进入全屏 API 时仍可见 */
.hzh-embed__exit-host {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: calc(12px + env(safe-area-inset-top, 0px)) 16px 0
    calc(12px + env(safe-area-inset-right, 0px));
  pointer-events: none;
}

.hzh-embed__exit-game {
  pointer-events: auto;
  padding: 10px 20px;
  border: 2px solid rgba(201, 162, 39, 0.85);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(45, 32, 22, 0.94), rgba(28, 20, 14, 0.96));
  color: #f5e6c8;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  font-family: 'STKaiti', 'KaiTi', 'PingFang SC', 'Microsoft YaHei', serif;
  cursor: pointer;
  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.hzh-embed__exit-game:hover {
  transform: translateY(-1px);
  border-color: rgba(232, 200, 120, 0.95);
  box-shadow:
    0 6px 22px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.hzh-embed__exit-game:focus {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(201, 162, 39, 0.45),
    0 4px 18px rgba(0, 0, 0, 0.45);
}
</style>