import { ref, onMounted, onUnmounted } from 'vue'

export function useGameLogic() {
  const score = ref(0)
  const currentLevel = ref(1)
  const timeLeft = ref(120)
  const pieces = ref([])
  const targetShape = ref('')
  const selectedPiece = ref(null)
  const showResult = ref(false)
  const isSuccess = ref(false)

  let timer = null
  let isDragging = false
  let dragOffset = { x: 0, y: 0 }

  const levels = [
    {
      targetShape: 'M50,50 L150,50 L150,100 L50,100 Z',
      pieces: [
        { id: 1, shape: 'M0,0 L50,0 L50,50 L0,50 Z', color: '#8B4513', x: 50, y: 150, rotation: 0 },
        { id: 2, shape: 'M0,0 L50,0 L50,50 L0,50 Z', color: '#A0522D', x: 150, y: 150, rotation: 0 },
        { id: 3, shape: 'M0,0 L50,0 L50,50 L0,50 Z', color: '#CD853F', x: 100, y: 200, rotation: 0 },
        { id: 4, shape: 'M0,0 L50,0 L50,50 L0,50 Z', color: '#DEB887', x: 50, y: 250, rotation: 0 },
        { id: 5, shape: 'M0,0 L50,0 L50,50 L0,50 Z', color: '#F4A460', x: 150, y: 250, rotation: 0 }
      ]
    }
  ]

  const initGame = () => {
    loadLevel(currentLevel.value)
    startTimer()
    setupKeyboardListeners()
  }

  const loadLevel = (level) => {
    const levelData = levels[level - 1]
    if (levelData) {
      targetShape.value = levelData.targetShape
      pieces.value = levelData.pieces.map(p => ({ ...p }))
    }
  }

  const startTimer = () => {
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        endGame(false)
      }
    }, 1000)
  }

  const startDrag = (piece, event) => {
    isDragging = true
    selectedPiece.value = piece.id
    dragOffset.x = event.clientX - piece.x
    dragOffset.y = event.clientY - piece.y

    const handleMouseMove = (e) => {
      if (isDragging) {
        piece.x = e.clientX - dragOffset.x
        piece.y = e.clientY - dragOffset.y
      }
    }

    const handleMouseUp = () => {
      isDragging = false
      checkWinCondition()
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const selectPiece = (piece) => {
    selectedPiece.value = piece.id
  }

  const rotatePiece = () => {
    const piece = pieces.value.find(p => p.id === selectedPiece.value)
    if (piece) {
      piece.rotation = (piece.rotation + 90) % 360
      checkWinCondition()
    }
  }

  const flipPiece = () => {
    const piece = pieces.value.find(p => p.id === selectedPiece.value)
    if (piece) {
      piece.flipped = !piece.flipped
      checkWinCondition()
    }
  }

  const checkWinCondition = () => {
    const allInPlace = pieces.value.every(piece => {
      return piece.x >= 50 && piece.x <= 150 && piece.y >= 50 && piece.y <= 100
    })

    if (allInPlace) {
      endGame(true)
    }
  }

  const endGame = (success) => {
    clearInterval(timer)
    isSuccess.value = success
    showResult.value = true

    if (success) {
      score.value += timeLeft.value * 10
    }
  }

  const resetLevel = () => {
    showResult.value = false
    timeLeft.value = 120
    loadLevel(currentLevel.value)
    startTimer()
  }

  const nextLevel = () => {
    showResult.value = false
    currentLevel.value++
    timeLeft.value = 120
    loadLevel(currentLevel.value)
    startTimer()
  }

  const setupKeyboardListeners = () => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') {
        rotatePiece()
      } else if (e.key === 'f' || e.key === 'F') {
        flipPiece()
      }
    })
  }

  const cleanup = () => {
    clearInterval(timer)
  }

  return {
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
  }
}
