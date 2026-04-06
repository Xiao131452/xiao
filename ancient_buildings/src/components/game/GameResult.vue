<template>
  <div class="game-result-overlay">
    <div class="result-modal">
      <div class="result-icon">
        {{ success ? '🎉' : '😢' }}
      </div>
      <h2 class="result-title">{{ success ? '恭喜通关！' : '再接再厉' }}</h2>
      <p class="result-score">得分：{{ score }}</p>
      
      <div class="result-buttons">
        <button @click="('retry')" class="result-btn retry">重试</button>
        <button v-if="success" @click="('next')" class="result-btn next">下一关</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  success: Boolean,
  score: Number
})

defineEmits(['retry', 'next'])
</script>

<style scoped>
.game-result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.result-modal {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  animation: modalIn 0.5s ease-out;
}

@keyframes modalIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.result-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.result-title {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #333;
}

.result-score {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.result-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.result-btn {
  padding: 15px 40px;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.result-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.result-btn.retry {
  background: #f0f0f0;
  color: #333;
}

.result-btn.next {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>