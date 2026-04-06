<template>
  <span class="typewriter-text">
    {{ displayedText }}<span class="cursor" v-if="showCursor">|</span>
  </span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    default: 50
  }
})

const displayedText = ref('')
const showCursor = ref(true)

const typeText = () => {
  displayedText.value = ''
  let index = 0
  
  const interval = setInterval(() => {
    if (index < props.text.length) {
      displayedText.value += props.text[index]
      index++
    } else {
      clearInterval(interval)
      setTimeout(() => {
        showCursor.value = false
      }, 500)
    }
  }, props.speed)
}

watch(() => props.text, () => {
  typeText()
})

onMounted(() => {
  typeText()
})
</script>

<style scoped>
.typewriter-text {
  display: inline;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
</style>
