<template>
  <div class="game-container">
    <GameHUD :score="score" :level="currentLevel" :time="timeLeft" @back="goBack" />
    
    <div class="game-board">
      <div class="pieces-container">
        <div 
          v-for="(piece, index) in pieces" 
          :key="piece.id"
          class="piece"
          :class="{ 'selected': selectedPiece === piece.id }"
          :style="{ 
            left: piece.x + 'px', 
            top: piece.y + 'px',
            transform: `rotate(${piece.rotation}deg)`
          }"
          @mousedown="startDrag(piece, $event)"
          @click="selectPiece(piece)"
        >
          <svg viewBox="0 0 100 100" class="piece-svg">
            <path :d="piece.shape" :fill="piece.color" stroke="#333" stroke-width="2"/>
          </svg>
        </div>
      </div>
      
      <div class="target-zone">
        <svg viewBox="0 0 400 300" class="target-svg">
          <path :d="targetShape" fill="none" stroke="#666" stroke-width="3" stroke-dasharray="5,5"/>
        </svg>
      </div>
    </div>

    <div class="game-controls">
      <button @click="rotatePiece" :disabled="!selectedPiece" class="control-btn">
        旋转 (R)
      </button>
      <button @click="flipPiece" :disabled="!selectedPiece" class="control-btn">
        翻转 (F)
      </button>
      <button @click="resetLevel" class="control-btn">
        重置
      </button>
    </div>

    <GameResult 
      v-if="showResult" 
      :success="isSuccess" 
      :score="score"
      @next="nextLevel"
      @retry="resetLevel"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import GameHUD from '../components/game/GameHUD.vue'
import GameResult from '../components/game/GameResult.vue'
import { useGameLogic } from '../composables/useGameLogic'

const router = useRouter()

const {
  score,
  currentLevel,
  timeLeft,
  pieces,
  targetShape,
  selectedPiece,
  showResult,
  isSuccess,
  startDrag,
  selectPiece,
  rotatePiece,
  flipPiece,
  resetLevel,
  nextLevel,
  initGame,
  cleanup
} = useGameLogic()

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  initGame()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.game-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
}

.game-board {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.pieces-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.piece {
  position: absolute;
  width: 80px;
  height: 80px;
  cursor: move;
  transition: transform 0.2s;
  z-index: 10;
}

.piece.selected {
  filter: drop-shadow(0 0 10px #ffd700);
}

.piece-svg {
  width: 100%;
  height: 100%;
}

.target-zone {
  width: 400px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.target-svg {
  width: 100%;
  height: 100%;
}

.game-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
}

.control-btn {
  padding: 12px 30px;
  font-size: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>