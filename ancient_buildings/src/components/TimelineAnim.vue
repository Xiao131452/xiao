<template>
  <div class="timeline-anim" ref="timelineRef">
    <div class="timeline-line"></div>
    <div 
      v-for="(item, index) in timelineItems" 
      :key="index"
      class="timeline-item"
      :class="{ 'active': activeItem === index }"
    >
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h4>{{ item.dynasty }}</h4>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const timelineRef = ref(null)
const activeItem = ref(0)

const timelineItems = ref([
  { dynasty: '唐代', description: '建筑风格雄浑大气，斗拱硕大有力' },
  { dynasty: '宋代', description: '建筑风格精致典雅，结构更加严谨' },
  { dynasty: '明代', description: '建筑风格庄重规整，装饰更加繁复' },
  { dynasty: '清代', description: '建筑风格华丽繁复，工艺达到顶峰' }
])

onMounted(() => {
  const items = timelineRef.value.querySelectorAll('.timeline-item')
  
  items.forEach((item, index) => {
    gsap.fromTo(item, 
      { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
          onEnter: () => activeItem.value = index,
          onEnterBack: () => activeItem.value = index
        }
      }
    )
  })
})
</script>

<style scoped>
.timeline-anim {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding: 40px 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #667eea, #764ba2);
  transform: translateX(-50%);
}

.timeline-item {
  display: flex;
  align-items: center;
  margin-bottom: 60px;
  opacity: 0;
}

.timeline-item:nth-child(even) {
  flex-direction: row-reverse;
}

.timeline-dot {
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 50%;
  margin: 0 30px;
  border: 4px solid white;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  transition: transform 0.3s, box-shadow 0.3s;
}

.timeline-item.active .timeline-dot {
  transform: scale(1.5);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
}

.timeline-content {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.timeline-item.active .timeline-content {
  transform: scale(1.05);
}

.timeline-content h4 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.timeline-content p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .timeline-line {
    left: 20px;
  }
  
  .timeline-item,
  .timeline-item:nth-child(even) {
    flex-direction: row;
    margin-left: 50px;
  }
  
  .timeline-dot {
    position: absolute;
    left: 10px;
    margin: 0;
  }
}
</style>
