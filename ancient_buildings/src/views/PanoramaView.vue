<template>
  <div class="pano-page">
    <h1>交互式全景</h1>
    <p>当前场景: {{ currentScene?.name }}</p>
    
    <!-- 调试信息面板 -->
    <div class="debug-panel">
      <h3>调试信息</h3>
      <p>Three.js: {{ !!window.THREE ? '✓ 已加载' : '✗ 未加载' }}</p>
      <p>Panolens: {{ !!window.PANOLENS ? '✓ 已加载' : '✗ 未加载' }}</p>
      <p>Viewer: {{ viewer ? '✓ 已创建' : '✗ 未创建' }}</p>
      <p>加载状态: {{ loading ? '加载中' : '完成' }}</p>
      <p>错误: {{ error || '无' }}</p>
      <p>容器: {{ panoContainer ? '✓ 已找到' : '✗ 未找到' }}</p>
    </div>
    
    <div ref="panoContainer" class="pano-container">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>正在加载全景...</p>
      </div>
      <div v-if="error" class="error-overlay">
        <div class="error-content">
          <h3>⚠️ 全景加载失败</h3>
          <p>{{ error }}</p>
          <div class="error-details">
            <p><strong>调试信息：</strong></p>
            <p>Three.js 库: {{ !!window.THREE ? '✓ 已加载' : '✗ 未加载' }}</p>
            <p>Panolens 库: {{ !!window.PANOLENS ? '✓ 已加载' : '✗ 未加载' }}</p>
            <p>当前图片: {{ currentScene?.image }}</p>
          </div>
          <button class="retry-btn" @click="retryLoad">重试</button>
        </div>
      </div>
    </div>
    
    <div class="scene-selector">
      <button 
        v-for="scene in Object.values(SCENES)" 
        :key="scene.id"
        @click="switchScene(scene.id)"
        :class="{ active: currentSceneId === scene.id }"
      >
        {{ scene.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { SCENES } from '../data/panoramaScenes'

const THREE_SRC = 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.min.js'
const PANOLENS_SRC = 'https://cdn.jsdelivr.net/npm/panolens@0.12.0/build/panolens.min.js'

function loadExternalScript(src, dataAttr) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-ext="${dataAttr}"]`)) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.dataset.ext = dataAttr
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`脚本加载失败: ${src}`))
    document.head.appendChild(s)
  })
}

async function ensurePanoramaLibs() {
  if (window.THREE && window.PANOLENS) return
  await loadExternalScript(THREE_SRC, 'panorama-three')
  await loadExternalScript(PANOLENS_SRC, 'panorama-panolens')
}

const panoContainer = ref(null)
const currentSceneId = ref('meridian-gate')
const loading = ref(false)
const error = ref(null)

const currentScene = computed(() => SCENES[currentSceneId.value])

let viewer = null
const panoramaMap = {}

onMounted(async () => {
  console.log('PanoramaView mounted')
  loading.value = true
  error.value = null
  try {
    await ensurePanoramaLibs()
  } catch (e) {
    console.error(e)
    error.value = '全景依赖（Three.js / Panolens）加载失败，请检查网络后刷新。'
    loading.value = false
    return
  }

  if (!window.THREE || !window.PANOLENS) {
    error.value = 'Three.js 或 Panolens 未就绪，请刷新重试。'
    loading.value = false
    return
  }

  initViewer()
  if (!viewer) {
    loading.value = false
    return
  }
  await loadScene('meridian-gate')
})

onUnmounted(() => {
  if (viewer) {
    viewer.dispose()
  }
})

function initViewer() {
  console.log('Initializing viewer...')
  if (!panoContainer.value) {
    console.error('Panorama container not found')
    return
  }

  try {
    viewer = new window.PANOLENS.Viewer({
      container: panoContainer.value,
      controlBar: false,
      autoRotate: true,
      autoRotateSpeed: 0.3,
      output: 'console'
    })
    console.log('Viewer initialized successfully')
  } catch (err) {
    console.error('Failed to initialize viewer:', err)
    error.value = '全景查看器初始化失败: ' + err.message
  }
}

async function loadScene(sceneId) {
  console.log('Loading scene:', sceneId)
  const sceneData = SCENES[sceneId]
  if (!sceneData) {
    console.error('Scene data not found:', sceneId)
    return
  }

  loading.value = true
  error.value = null

  try {
    if (panoramaMap[sceneId]) {
      console.log('Using cached panorama')
      viewer.setPanorama(panoramaMap[sceneId])
      loading.value = false
    } else {
      console.log('Creating new panorama with image:', sceneData.image)
      const panorama = new window.PANOLENS.ImagePanorama(sceneData.image)
      
      panorama.addEventListener('load', () => {
        console.log('全景加载成功:', sceneId)
        loading.value = false
      })
      
      panorama.addEventListener('error', (err) => {
        console.error('全景加载失败:', err)
        error.value = '无法加载全景图片，请检查网络连接或更换图片源'
        loading.value = false
      })
      
      panoramaMap[sceneId] = panorama
      viewer.add(panorama)
      viewer.setPanorama(panorama)
    }

    currentSceneId.value = sceneId
  } catch (err) {
    console.error('场景加载错误:', err)
    error.value = '场景加载失败: ' + err.message
    loading.value = false
  }
}

async function switchScene(targetId) {
  if (viewer) {
    viewer.autoRotate = false
  }
  await loadScene(targetId)
  setTimeout(() => {
    if (viewer) {
      viewer.autoRotate = true
    }
  }, 3000)
}

function retryLoad() {
  error.value = null
  loadScene(currentSceneId.value)
}
</script>

<style scoped>
.pano-page {
  width: 100%;
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  padding: 20px;
}

.pano-page h1 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #ffd700;
}

.debug-panel {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.debug-panel h3 {
  margin: 0 0 10px 0;
  color: #ffd700;
  font-size: 16px;
}

.debug-panel p {
  margin: 5px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.pano-page p {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.pano-container {
  width: 100%;
  height: 500px;
  background: #000;
  border-radius: 16px;
  margin-bottom: 20px;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  color: white;
  font-size: 16px;
  margin: 0;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

.error-content {
  text-align: center;
  color: white;
  max-width: 400px;
  padding: 40px;
}

.error-content h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #ff6b6b;
}

.error-content p {
  font-size: 16px;
  margin-bottom: 24px;
  line-height: 1.6;
}

.error-details {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: left;
}

.error-details p {
  font-size: 14px;
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.8);
}

.error-details strong {
  color: #ffd700;
}

.retry-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.scene-selector {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.scene-selector button {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.scene-selector button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.scene-selector button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}
</style>