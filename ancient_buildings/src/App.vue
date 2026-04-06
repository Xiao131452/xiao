<template>
  <div id="app">
    <div v-if="showSplash" class="splash-screen" @click="handleSplashClick">
      <video
        ref="splashVideoRef"
        class="splash-video"
        src="/videos/building_demo.mp4"
        :muted="isMuted"
        autoplay
        playsinline
        preload="auto"
        @ended="handleVideoEnded"
      />

      <div class="splash-controls">
        <button type="button" class="skip-btn" @click.stop="skipSplash">
          跳过
        </button>
        <button type="button" class="sound-btn" @click.stop="toggleSound">
          {{ isMuted ? '🔇 开声音' : '🔊 关闭声音' }}
        </button>
      </div>

      <div class="splash-enter-tip" :class="{ ready: isVideoEnded }">
        <p v-if="!isVideoEnded">开屏动画播放中...</p>
        <p v-else>点击任意位置进入网页</p>
      </div>
    </div>

    <!-- 始终挂载路由页，避免仅含 fixed 开屏时 #app 高度塌成 0、关屏后主区域不占位导致「整页白屏」；开屏层 z-index 盖住主界面即可 -->
    <div class="app-shell" :inert="showSplash || undefined" :aria-hidden="showSplash ? true : undefined">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const showSplash = ref(true)
const isMuted = ref(true)
const isVideoEnded = ref(false)
const splashVideoRef = ref(null)

const toggleSound = async () => {
  isMuted.value = !isMuted.value
  const video = splashVideoRef.value
  if (!video) return
  video.muted = isMuted.value
  try {
    if (video.paused && !isVideoEnded.value) {
      await video.play()
    }
  } catch {
    // ignore browser autoplay restrictions
  }
}

const handleVideoEnded = () => {
  isVideoEnded.value = true
}

const handleSplashClick = () => {
  if (!isVideoEnded.value) return
  const video = splashVideoRef.value
  if (video) {
    try {
      video.pause()
    } catch {
      /* ignore */
    }
  }
  showSplash.value = false
}

const skipSplash = () => {
  const video = splashVideoRef.value
  if (video) {
    try {
      video.pause()
    } catch {
      /* ignore */
    }
  }
  isVideoEnded.value = true
  showSplash.value = false
}

const setScrollLock = (locked) => {
  if (locked) {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  } else {
    document.documentElement.style.removeProperty('overflow')
    document.body.style.removeProperty('overflow')
  }
}

watch(showSplash, (visible) => setScrollLock(visible), { immediate: true })

onBeforeUnmount(() => {
  setScrollLock(false)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  min-height: 100vh;
  background: transparent;
}

.app-shell {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
}

.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  overflow: hidden;
}

.splash-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.splash-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
  display: flex;
  gap: 10px;
  align-items: center;
}

.sound-btn {
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(6px);
}

.skip-btn {
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(6px);
}

.splash-enter-tip {
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  z-index: 2;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

.splash-enter-tip.ready {
  color: #fff;
  font-weight: 700;
}
</style>