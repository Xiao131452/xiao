<template>
  <div class="intro-container">
    <header class="intro-header">
      <h1>中国传统古建筑</h1>
      <p>探索千年建筑智慧 · 感受榫卯结构之美</p>
    </header>

    <section class="intro-section" v-for="(section, index) in sections" :key="index">
      <BuildingCard 
        :title="section.title" 
        :description="section.description"
        :image="section.image"
        :reverse="index % 2 === 1"
      />
    </section>

    <section class="structure-section">
      <h2>榫卯结构拆解</h2>
      <StructureSVGAnim />
    </section>

    <section class="timeline-section">
      <h2>建筑朝代演变</h2>
      <TimelineAnim />
    </section>

    <div class="game-cta">
      <button @click="goToMap" class="cta-button map-btn">🗺️ 古建筑地图</button>
      <button @click="goToPanorama" class="cta-button panorama-btn">🏛️ 交互式全景</button>
      <button @click="goToGame" class="cta-button">🎮 体验榫卯小游戏</button>
    </div>

    <ChatWindow />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BuildingCard from '../components/BuildingCard.vue'
import StructureSVGAnim from '../components/StructureSVGAnim.vue'
import TimelineAnim from '../components/TimelineAnim.vue'
import ChatWindow from '../components/chat/ChatWindow.vue'

const router = useRouter()

const sections = ref([
  {
    title: '故宫 · 紫禁城',
    description: '明清两代的皇家宫殿，中国古代宫廷建筑之精华，无与伦比的建筑杰作。',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800'
  },
  {
    title: '天坛 · 祈年殿',
    description: '明清两代皇帝祭天、祈谷的场所，中国古代建筑艺术的杰出代表。',
    image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800'
  },
  {
    title: '应县木塔',
    description: '世界上现存最古老、最高的木结构楼阁式塔，榫卯结构的完美体现。',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'
  }
])

const goToGame = () => {
  router.push('/game')
}

const goToMap = () => {
  router.push('/map')
}

const goToPanorama = () => {
  router.push('/panorama')
}
</script>

<style scoped>
.intro-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.intro-header {
  text-align: center;
  padding: 80px 20px;
  color: white;
}

.intro-header h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.intro-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.intro-section {
  padding: 60px 20px;
  background: white;
}

.structure-section,
.timeline-section {
  padding: 80px 20px;
  background: #f8f9fa;
  text-align: center;
}

.structure-section h2,
.timeline-section h2 {
  font-size: 2rem;
  margin-bottom: 40px;
  color: #333;
}

.game-cta {
  padding: 80px 20px;
  text-align: center;
  background: white;
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 15px 40px;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.map-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.panorama-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
</style>