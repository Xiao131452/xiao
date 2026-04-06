<template>
  <div class="game-hud">
    <button @click="('back')" class="back-btn">← 返回</button>
    
    <div class="hud-stats">
      <div class="stat-item">
        <span class="stat-label">关卡</span>
        <span class="stat-value">{{ level }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">得分</span>
        <span class="stat-value">{{ score }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">时间</span>
        <span class="stat-value" :class="{ 'warning': timeLeft <= 30 }">{{ formatTime(timeLeft) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  score: Number,
  level: Number,
  timeLeft: Number
})

defineEmits(['back'])

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.game-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.back-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hud-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.stat-value.warning {
  color: #ff6b6b;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .hud-stats {
    gap: 20px;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
}
</style>