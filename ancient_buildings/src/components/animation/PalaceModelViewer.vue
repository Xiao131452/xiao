<template>
  <div class="viewer-card">
    <div class="model-stage">
      <div ref="modelWrapperRef" class="model-wrapper">
        <model-viewer
          ref="modelViewerRef"
          :src="resolvedSrc"
          :alt="modelAlt"
          camera-controls
          camera-target="auto"
          :camera-orbit="cameraOrbit"
          :field-of-view="fieldOfViewStr"
          :auto-rotate="autoRotate"
          :rotation-per-second="rotationPerSecondStr"
          :orbit-sensitivity="dragSensitivity"
          :auto-rotate-delay="3000"
          shadow-intensity="0.5"
          environment-image="neutral"
          exposure="1.2"
          loading="eager"
          interaction-prompt="none"
          touch-action="manipulation"
          min-camera-orbit="auto auto auto"
          max-camera-orbit="auto auto auto"
          min-field-of-view="0.1deg"
          max-field-of-view="120deg"
          style="width:100%;height:100%;display:block;background:#1a1a1a;"
          @load="onModelLoad"
          @error="onModelError"
          @camera-change="onCameraChange"
          @progress="onProgress"
        />

        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>正在加载 3D 模型...</p>
          <p class="load-hint">首次加载约 200MB+，等几分钟是正常的。</p>
          <p class="load-elapsed">已等待 {{ loadElapsedSec }} 秒</p>
          <p v-if="loadProgress > 0 && loadProgress < 100" class="load-progress">解析进度约 {{ loadProgress }}%</p>
        </div>

        <div v-if="loadError" class="error-overlay">
          <div class="error-content">
            <p class="error-title">加载失败</p>
            <p class="error-msg">{{ loadError }}</p>
            <button type="button" class="retry-btn" @click="retryLoad">重试加载</button>
          </div>
        </div>

        <div v-if="!isLoading && !loadError" class="interaction-hint">
          <p>拖拽旋转 | 滚轮缩放 | 两指缩放</p>
        </div>
        <div v-if="!isLoading && !loadError" class="zoom-display">{{ zoomDisplay }}%</div>
      </div>
    </div>

    <div v-if="!isLoading && !loadError" class="control-panel">
      <div class="panel-content">
        <h3>{{ buildingName }}</h3>
        <p class="desc">{{ buildingDescription }}</p>
        <div class="section">
          <div class="section-header"><span>缩放级别</span><span class="badge">{{ zoomDisplay }}%</span></div>
          <input v-model.number="zoomLevel" class="slider" type="range" min="1000" max="50000" step="500" @input="handleZoomChange" />
          <div class="hint-text">初始化: 25000% | 最大: 50000%</div>
          <div class="presets">
            <button v-for="p in zoomPresets" :key="p.value" :class="['preset-btn', { active: isZoomPresetActive(p.value) }]" @click="setZoom(p.value)">{{ p.label }}</button>
          </div>
        </div>
        <div class="section">
          <div class="section-header"><span>旋转速度</span><span class="badge">{{ rotationSpeedDisplay }}x</span></div>
          <input v-model.number="rotationSpeed" class="slider" type="range" min="0.1" max="3" step="0.1" @input="syncRotationToViewer" />
          <div class="presets">
            <button v-for="sp in speedPresets" :key="sp.value" :class="['preset-btn', { active: isSpeedPresetActive(sp.value) }]" @click="setRotationSpeed(sp.value)">{{ sp.label }}</button>
          </div>
        </div>
        <div class="section">
          <div class="section-header"><span>拖拽感应度</span><span class="badge">{{ dragSensitivityDisplay }}x</span></div>
          <input v-model.number="dragSensitivity" class="slider" type="range" min="0.1" max="2" step="0.1" @input="syncOrbitSensitivity" />
          <div class="presets">
            <button v-for="s in sensitivityPresets" :key="s.value" :class="['preset-btn', { active: isSensitivityPresetActive(s.value) }]" @click="setSensitivity(s.value)">{{ s.label }}</button>
          </div>
        </div>
        <div class="section">
          <div class="section-header"><span>视角预设</span></div>
          <div class="presets grid3">
            <button v-for="v in viewPresets" :key="v.label" :class="['preset-btn', { active: currentView === v.label }]" @click="setView(v)">{{ v.label }}</button>
          </div>
        </div>
        <div class="section actions">
          <button :class="['ctrl-btn', { active: autoRotate }]" @click="toggleAutoRotate">{{ autoRotate ? '暂停旋转' : '开启旋转' }}</button>
          <button class="ctrl-btn" @click="resetCamera">重置视角</button>
          <button class="ctrl-btn" @click="resetZoom">重置缩放 (25000%)</button>
          <button class="ctrl-btn" @click="downloadModel">下载模型</button>
        </div>

        <div class="info-box">
          <p><strong>建筑年代：</strong>{{ buildingEra }}</p>
          <p><strong>建筑风格：</strong>{{ buildingStyle }}</p>
          <p><strong>模型格式：</strong>{{ modelFormat }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelSrc: { type: String, default: '/taihedian.glb' },
  modelAlt: { type: String, default: '故宫太和殿 3D 模型' },
  buildingName: { type: String, default: '故宫 · 太和殿' },
  buildingDescription: { type: String, default: '明清两代皇家宫殿核心建筑之一，太和殿为举行大典的场所。' },
  buildingEra: { type: String, default: '明永乐十八年（1420年）始建，后世多次修缮' },
  buildingStyle: { type: String, default: '明清宫殿建筑' },
  modelFormat: { type: String, default: 'glTF 2.0 (.glb)' },
})
const emit = defineEmits(['modelLoaded', 'error'])

const ZOOM_MIN = 1000
const ZOOM_MAX = 50000
const ZOOM_REF = 25000
const BASE_FOV = 2
const ORBIT_RADIUS = '1%'

const modelViewerRef = ref(null)
const modelWrapperRef = ref(null)
const isLoading = ref(true)
const loadProgress = ref(0)
const loadError = ref('')
const loadElapsedSec = ref(0)
const autoRotate = ref(false)
const zoomLevel = ref(ZOOM_REF)
const fieldOfView = ref(BASE_FOV)
const cameraOrbit = ref(`0deg 75deg ${ORBIT_RADIUS}`)
const currentView = ref('默认')
const rotationSpeed = ref(0.5)
const dragSensitivity = ref(1)

const resolvedSrc = computed(() => {
  const s = props.modelSrc
  if (!s || /^https?:\/\//i.test(s) || s.startsWith('//')) return s
  const base = import.meta.env.BASE_URL || '/'
  if (base === '/') return s.startsWith('/') ? s : `/${s}`
  const trimmed = base.endsWith('/') ? base.slice(0, -1) : base
  return `${trimmed}${s.startsWith('/') ? s : `/${s}`}`
})
const fieldOfViewStr = computed(() => `${fieldOfView.value}deg`)
const rotationPerSecondStr = computed(() => `${(5.625 * rotationSpeed.value).toFixed(2)}deg`)
const zoomDisplay = computed(() => Math.round(zoomLevel.value))
const rotationSpeedDisplay = computed(() => rotationSpeed.value.toFixed(1))
const dragSensitivityDisplay = computed(() => dragSensitivity.value.toFixed(1))

const zoomPresets = [{ label: '1000%', value: 1000 }, { label: '10000%', value: 10000 }, { label: '25000%', value: 25000 }, { label: '50000%', value: 50000 }]
const speedPresets = [{ label: '极慢', value: 0.2 }, { label: '慢', value: 0.5 }, { label: '中', value: 1.0 }, { label: '快', value: 2.0 }]
const sensitivityPresets = [{ label: '低', value: 0.3 }, { label: '中', value: 0.7 }, { label: '高', value: 1.2 }, { label: '极高', value: 2.0 }]
const viewPresets = [
  { label: '默认', orbit: `0deg 75deg ${ORBIT_RADIUS}`, fov: BASE_FOV },
  { label: '俯视', orbit: `0deg 90deg ${ORBIT_RADIUS}`, fov: 1.5 },
  { label: '侧视', orbit: `90deg 45deg ${ORBIT_RADIUS}`, fov: BASE_FOV },
  { label: '正面', orbit: `0deg 30deg ${ORBIT_RADIUS}`, fov: 2.5 },
  { label: '背面', orbit: `180deg 30deg ${ORBIT_RADIUS}`, fov: 2.5 },
  { label: '45度角', orbit: `45deg 60deg ${ORBIT_RADIUS}`, fov: BASE_FOV },
]
const isZoomPresetActive = v => Math.abs(zoomLevel.value - v) < 250
const isSpeedPresetActive = v => Math.abs(rotationSpeed.value - v) < 0.051
const isSensitivityPresetActive = v => Math.abs(dragSensitivity.value - v) < 0.051

function applyCameraToViewer() {
  const el = modelViewerRef.value
  if (!el) return
  try {
    el.fieldOfView = `${fieldOfView.value}deg`
    el.cameraOrbit = cameraOrbit.value
    el.cameraTarget = 'auto'
  } catch {}
}
function handleZoomChange() {
  const z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomLevel.value))
  zoomLevel.value = z
  fieldOfView.value = Math.max(0.1, Math.min(120, BASE_FOV * (ZOOM_REF / z)))
  const parts = cameraOrbit.value.trim().split(/\s+/)
  cameraOrbit.value = parts.length >= 2 ? `${parts[0]} ${parts[1]} ${ORBIT_RADIUS}` : `0deg 75deg ${ORBIT_RADIUS}`
  applyCameraToViewer()
}
function setZoom(v) {
  zoomLevel.value = v
  handleZoomChange()
}
function setView(v) {
  currentView.value = v.label
  const p = v.orbit.trim().split(/\s+/)
  cameraOrbit.value = p.length >= 2 ? `${p[0]} ${p[1]} ${ORBIT_RADIUS}` : v.orbit
  fieldOfView.value = v.fov
  applyCameraToViewer()
}
function resetZoom() {
  zoomLevel.value = ZOOM_REF
  fieldOfView.value = BASE_FOV
  cameraOrbit.value = `0deg 75deg ${ORBIT_RADIUS}`
  currentView.value = '默认'
  applyCameraToViewer()
}
function syncRotationToViewer() {
  if (modelViewerRef.value) modelViewerRef.value.rotationPerSecond = rotationPerSecondStr.value
}
function setRotationSpeed(v) {
  rotationSpeed.value = v
  syncRotationToViewer()
}
function syncOrbitSensitivity() {
  if (modelViewerRef.value) modelViewerRef.value.orbitSensitivity = dragSensitivity.value
}
function setSensitivity(v) {
  dragSensitivity.value = v
  nextTick(syncOrbitSensitivity)
}
function onCameraChange() {
  const el = modelViewerRef.value
  if (!el || typeof el.cameraOrbit !== 'string') return
  const p = el.cameraOrbit.trim().split(/\s+/)
  if (p.length >= 2) cameraOrbit.value = `${p[0]} ${p[1]} ${ORBIT_RADIUS}`
}

const onModelLoad = () => {
  if (!isLoading.value) return
  stopLoadElapsedTimer()
  isLoading.value = false
  loadError.value = ''
  loadProgress.value = 100
  emit('modelLoaded')
  setTimeout(() => {
    resetZoom()
  }, 300)
}
const onModelError = e => {
  stopLoadElapsedTimer()
  const raw = e?.detail?.message || (typeof e?.detail === 'string' ? e.detail : '') || '未知错误'
  loadError.value = `模型加载失败：${raw}`
  isLoading.value = false
  emit('error', e)
}
const onProgress = e => {
  const t = e?.detail?.totalProgress ?? e?.detail?.progress
  if (typeof t === 'number' && !Number.isNaN(t)) loadProgress.value = Math.min(100, Math.round(t * 100))
}

let detachListeners = null
function attachModelViewerListeners() {
  detachListeners?.()
  detachListeners = null
  const el = modelViewerRef.value
  if (!el || typeof el.addEventListener !== 'function') return
  const onLoad = () => onModelLoad()
  const onErr = ev => onModelError(ev)
  const onProg = ev => onProgress(ev)
  el.addEventListener('load', onLoad)
  el.addEventListener('error', onErr)
  el.addEventListener('progress', onProg)
  detachListeners = () => {
    el.removeEventListener('load', onLoad)
    el.removeEventListener('error', onErr)
    el.removeEventListener('progress', onProg)
  }
}
function retryLoad() {
  loadError.value = ''
  isLoading.value = true
  loadProgress.value = 0
  startLoadElapsedTimer()
  const el = modelViewerRef.value
  if (el) {
    const src = resolvedSrc.value
    el.src = ''
    setTimeout(() => {
      el.src = src
      nextTick(attachModelViewerListeners)
    }, 100)
  }
}
function handleMouseWheel(e) {
  if (!e.target?.closest?.('model-viewer')) return
  e.preventDefault()
  const delta = e.deltaY < 0 ? 1000 : -1000
  zoomLevel.value = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomLevel.value + delta))
  handleZoomChange()
}

let loadElapsedTimer = null
function startLoadElapsedTimer() {
  stopLoadElapsedTimer()
  loadElapsedSec.value = 0
  loadElapsedTimer = setInterval(() => {
    loadElapsedSec.value += 1
  }, 1000)
}
function stopLoadElapsedTimer() {
  if (loadElapsedTimer) {
    clearInterval(loadElapsedTimer)
    loadElapsedTimer = null
  }
}

let wheelAttachedEl = null
onMounted(() => {
  startLoadElapsedTimer()
  nextTick(() => {
    attachModelViewerListeners()
    const wrap = modelWrapperRef.value
    if (wrap) {
      wrap.addEventListener('wheel', handleMouseWheel, { passive: false })
      wheelAttachedEl = wrap
    }
  })
})
onBeforeUnmount(() => {
  stopLoadElapsedTimer()
  detachListeners?.()
  wheelAttachedEl?.removeEventListener('wheel', handleMouseWheel)
})

watch(
  () => resolvedSrc.value,
  () => {
    isLoading.value = true
    loadProgress.value = 0
    loadError.value = ''
    startLoadElapsedTimer()
    nextTick(attachModelViewerListeners)
  }
)

const toggleAutoRotate = () => {
  autoRotate.value = !autoRotate.value
  if (modelViewerRef.value) modelViewerRef.value.autoRotate = autoRotate.value
  syncRotationToViewer()
}
const resetCamera = () => {
  currentView.value = '默认'
  zoomLevel.value = ZOOM_REF
  fieldOfView.value = BASE_FOV
  cameraOrbit.value = `0deg 75deg ${ORBIT_RADIUS}`
  applyCameraToViewer()
  syncOrbitSensitivity()
}

const downloadModel = () => {
  const link = document.createElement('a')
  link.href = resolvedSrc.value
  link.download = `${props.buildingName.replace(/\s+/g, '_')}.glb`
  link.rel = 'noopener'
  link.click()
}

watch(rotationSpeed, () => nextTick(syncRotationToViewer))
watch(dragSensitivity, () => nextTick(syncOrbitSensitivity))
</script>

<style scoped>
.viewer-card { --primary:#667eea; --secondary:#764ba2; --radius:16px; display:flex; width:100%; max-width:1200px; height:560px; margin:0 auto; border-radius:var(--radius); overflow:hidden; box-shadow:0 12px 40px rgba(0,0,0,.35); background:#1a1a2e; }
.model-stage { position:relative; flex:1; min-width:0; background:#1a1a1a; }
.model-wrapper { position:relative; width:100%; height:100%; overflow:hidden; }
.model-wrapper :deep(model-viewer) { position:absolute; inset:0; width:100% !important; height:100% !important; --poster-color:#1a1a1a; }
.control-panel { width:340px; flex-shrink:0; background:rgba(255,255,255,.97); overflow-y:auto; border-left:1px solid rgba(0,0,0,.06); }
.panel-content { padding:20px; }
.panel-content h3 { margin:0 0 6px; font-size:1.1rem; font-weight:700; color:#1a1a2e; }
.desc { font-size:12px; color:#666; line-height:1.55; margin:0 0 16px; }
.section { margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid #eee; }
.section-header { display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:600; color:#333; margin-bottom:8px; }
.badge { background:linear-gradient(135deg,var(--primary),var(--secondary)); color:#fff; padding:3px 9px; border-radius:4px; font-size:11px; font-weight:700; }
.hint-text { font-size:11px; color:#aaa; margin-bottom:8px; }
.slider { width:100%; height:5px; border-radius:3px; background:#e0e0e0; outline:none; -webkit-appearance:none; appearance:none; margin-bottom:10px; cursor:pointer; }
.presets { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; }
.presets.grid3 { grid-template-columns:repeat(3,1fr); }
.preset-btn { padding:6px 4px; border:1.5px solid #ddd; background:#fff; border-radius:6px; font-size:11px; font-weight:600; color:#444; cursor:pointer; transition:all .2s; }
.preset-btn:hover { border-color:var(--primary); color:var(--primary); }
.preset-btn.active { background:linear-gradient(135deg,var(--primary),var(--secondary)); border-color:transparent; color:#fff; }
.actions { display:flex; flex-direction:column; gap:8px; }
.ctrl-btn { padding:9px 12px; border:1.5px solid #ddd; border-radius:8px; background:#fff; font-size:12px; font-weight:600; color:#333; cursor:pointer; }
.ctrl-btn:hover { border-color:var(--primary); color:var(--primary); }
.ctrl-btn.active { background:linear-gradient(135deg,var(--primary),var(--secondary)); border-color:transparent; color:#fff; }
.info-box { padding:10px 12px; background:#f7f7f7; border-left:3px solid var(--primary); border-radius:6px; font-size:11px; }
.info-box p { margin:4px 0; color:#666; }
.info-box strong { color:#333; }
.interaction-hint { position:absolute; top:10px; left:10px; background:rgba(255,255,255,.1); backdrop-filter:blur(8px); color:#fff; padding:8px 12px; border-radius:7px; font-size:11px; z-index:10; pointer-events:none; }
.interaction-hint p { margin:0; }
.zoom-display { position:absolute; top:10px; right:10px; background:rgba(255,255,255,.15); backdrop-filter:blur(8px); color:#fff; padding:8px 14px; border-radius:7px; font-size:14px; font-weight:700; z-index:10; pointer-events:none; }
.loading-overlay { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center; background:rgba(0,0,0,.75); z-index:100; color:#fff; text-align:center; padding:20px; }
.loading-spinner { width:44px; height:44px; border:4px solid rgba(255,255,255,.2); border-top-color:var(--primary); border-radius:50%; animation:spin .9s linear infinite; margin-bottom:12px; }
.load-hint { font-size:12px; opacity:.85; max-width:300px; line-height:1.5; }
.load-elapsed, .load-progress { font-size:12px; opacity:.8; }
.error-overlay { position:absolute; inset:0; z-index:101; display:flex; justify-content:center; align-items:center; background:rgba(0,0,0,.85); padding:20px; }
.error-content { text-align:center; max-width:360px; }
.error-title { color:#ff6b6b; font-size:17px; margin:0 0 8px; font-weight:600; }
.error-msg { color:#fff; font-size:13px; margin:0 0 14px; word-break:break-word; }
.retry-btn { padding:9px 20px; background:var(--primary); color:#fff; border:none; border-radius:7px; font-size:13px; font-weight:600; cursor:pointer; }
@keyframes spin { to { transform:rotate(360deg); } }
@media (max-width:768px) {
  .viewer-card { flex-direction:column; height:auto; }
  .model-stage { height:300px; flex:none; }
  .control-panel { width:100%; border-left:none; border-top:1px solid #eee; }
  .presets { grid-template-columns:repeat(2,1fr); }
}
</style>