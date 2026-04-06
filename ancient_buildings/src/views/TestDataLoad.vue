<template>
  <div class="test-page">
    <h1>数据加载测试</h1>
    
    <div v-if="loading" class="status loading">
      <div class="spinner"></div>
      <p>正在加载数据...</p>
    </div>
    
    <div v-else-if="error" class="status error">
      <p>❌ 加载失败</p>
      <p>{{ error }}</p>
      <button @click="retry">重试</button>
    </div>
    
    <div v-else class="status success">
      <p>✅ 加载成功</p>
      <div class="stats">
        <p><strong>建筑数量:</strong> {{ buildingCount }}</p>
        <p><strong>数据类型:</strong> {{ dataType }}</p>
        <p><strong>朝代数量:</strong> {{ dynastyCount }}</p>
      </div>
      <div class="sample">
        <h3>示例数据（前3个）</h3>
        <div v-for="(building, index) in sampleBuildings" :key="index" class="building-item">
          <p><strong>{{ building.name }}</strong></p>
          <p>{{ building.dynasty }} · {{ building.year }} · {{ building.province }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const error = ref(null)
const buildingCount = ref(0)
const dataType = ref('')
const dynastyCount = ref(0)
const sampleBuildings = ref([])

const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('开始加载数据...')
    
    const response = await fetch('/src/data/building_coords.json')
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }
    
    const data = await response.json()
    
    console.log('数据加载成功:', data)
    
    buildingCount.value = data.length
    dataType.value = Array.isArray(data) ? '数组' : typeof data
    sampleBuildings.value = data.slice(0, 3)
    
    const dynasties = new Set()
    data.forEach(b => {
      if (b.dynasty) dynasties.add(b.dynasty)
    })
    dynastyCount.value = dynasties.size
    
    loading.value = false
  } catch (err) {
    console.error('加载失败:', err)
    error.value = err.message
    loading.value = false
  }
}

const retry = () => {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.test-page {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.status {
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  margin: 20px 0;
}

.status.loading {
  background: #e3f2fd;
}

.status.success {
  background: #e8f5e9;
}

.status.error {
  background: #ffebee;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stats {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: left;
}

.stats p {
  margin: 10px 0;
  font-size: 16px;
}

.sample {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.sample h3 {
  margin-top: 0;
  color: #333;
}

.building-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.building-item:last-child {
  border-bottom: none;
}

.building-item strong {
  color: #2196f3;
}

button {
  padding: 10px 20px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  background: #1976d2;
}
</style>