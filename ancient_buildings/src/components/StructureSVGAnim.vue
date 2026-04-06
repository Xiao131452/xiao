<template>
  <div class="structure-anim" ref="containerRef">
    <svg viewBox="0 0 800 400" class="structure-svg">
      <g v-for="(part, index) in parts" :key="index" :ref="el => setPartRef(el, index)">
        <path :d="part.path" :fill="part.color" stroke="#333" stroke-width="2"/>
      </g>
    </svg>
    <div class="controls">
      <button @click="animateAssemble" class="anim-btn">组装</button>
      <button @click="animateDisassemble" class="anim-btn">拆解</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const containerRef = ref(null)
const partRefs = ref([])

const parts = ref([
  { path: 'M100,200 L200,200 L200,250 L100,250 Z', color: '#8B4513', x: 0, y: 0 },
  { path: 'M200,150 L300,150 L300,200 L200,200 Z', color: '#A0522D', x: 100, y: -50 },
  { path: 'M300,200 L400,200 L400,250 L300,250 Z', color: '#CD853F', x: 200, y: 0 },
  { path: 'M400,150 L500,150 L500,200 L400,200 Z', color: '#DEB887', x: 300, y: -50 },
  { path: 'M500,200 L600,200 L600,250 L500,250 Z', color: '#F4A460', x: 400, y: 0 }
])

const setPartRef = (el, index) => {
  if (el) partRefs.value[index] = el
}

const animateAssemble = () => {
  partRefs.value.forEach((part, index) => {
    gsap.to(part, {
      x: 0,
      y: 0,
      duration: 1,
      delay: index * 0.2,
      ease: 'power2.out'
    })
  })
}

const animateDisassemble = () => {
  partRefs.value.forEach((part, index) => {
    const offsetX = (index - 2) * 100
    const offsetY = index % 2 === 0 ? 50 : -50
    gsap.to(part, {
      x: offsetX,
      y: offsetY,
      duration: 1,
      delay: index * 0.1,
      ease: 'power2.in'
    })
  })
}

onMounted(() => {
  animateDisassemble()
})
</script>

<style scoped>
.structure-anim {
  max-width: 800px;
  margin: 0 auto;
}

.structure-svg {
  width: 100%;
  height: auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.anim-btn {
  padding: 12px 30px;
  font-size: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.anim-btn:hover {
  transform: translateY(-2px);
}
</style>
