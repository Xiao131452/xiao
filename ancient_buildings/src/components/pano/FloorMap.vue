<template> 
  <div class="floor-map"> 
    <svg viewBox="0 0 120 300" width="60" height="150"> 
      <!-- 南北中轴建筑群简化平面 --> 
      <rect x="40" y="260" width="40" height="20" rx="2" 
        :class="{ active: currentScene === 'meridian-gate' }" 
        @click="$emit('jump', 'meridian-gate')" 
        class="map-room" /> 
      <text x="60" y="274" text-anchor="middle" font-size="5" fill="currentColor">午门</text> 
 
      <rect x="35" y="190" width="50" height="55" rx="2" 
        :class="{ active: currentScene === 'hall-of-supreme-harmony' }" 
        @click="$emit('jump', 'hall-of-supreme-harmony')" 
        class="map-room" /> 
      <text x="60" y="220" text-anchor="middle" font-size="5" fill="currentColor">太和殿</text> 
 
      <rect x="30" y="110" width="60" height="65" rx="2" 
        :class="{ active: currentScene === 'hall-of-central-harmony' }" 
        @click="$emit('jump', 'hall-of-central-harmony')" 
        class="map-room" /> 
      <text x="60" y="146" text-anchor="middle" font-size="5" fill="currentColor">中和殿</text> 
 
      <rect x="35" y="20" width="50" height="75" rx="2" 
        :class="{ active: currentScene === 'imperial-garden' }" 
        @click="$emit('jump', 'imperial-garden')" 
        class="map-room" /> 
      <text x="60" y="60" text-anchor="middle" font-size="5" fill="currentColor">御花园</text> 
 
      <!-- 中轴连接线 --> 
      <line x1="60" y1="20" x2="60" y2="280" stroke="#444" stroke-width="0.5" stroke-dasharray="2 2"/> 
 
      <!-- 当前位置指示点 --> 
      <circle 
        :cy="currentDotY" 
        cx="60" r="4" 
        fill="#7F77DD" 
        opacity="0.9" 
      > 
        <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/> 
      </circle> 
    </svg> 
  </div> 
</template> 
 
<script setup> 
import { computed } from 'vue' 
const props = defineProps({ currentScene: String }) 
defineEmits(['jump']) 
 
const dotYMap = { 
  'meridian-gate': 222, 
  'hall-of-supreme-harmony': 142, 
  'hall-of-central-harmony': 142, 
  'hall-of-preserving-harmony': 142, 
  'imperial-garden': 57 
} 
const currentDotY = computed(() => dotYMap[props.currentScene] ?? 222) 
</script> 
 
<style scoped> 
.floor-map { 
  background: rgba(0,0,0,0.5); 
  border: 1px solid rgba(255,255,255,0.15); 
  border-radius: 6px; 
  padding: 6px; 
} 
.map-room { 
  fill: rgba(255,255,255,0.08); 
  stroke: rgba(255,255,255,0.3); 
  stroke-width: 0.5; 
  cursor: pointer; 
  transition: fill 0.2s; 
} 
.map-room:hover { fill: rgba(127, 119, 221, 0.25); } 
.map-room.active { fill: rgba(127, 119, 221, 0.4); stroke: #7F77DD; } 
</style>