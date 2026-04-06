<template>
  <div class="building-card" :class="{ 'reverse': reverse }">
    <div class="card-image">
      <img :src="image" :alt="title" />
    </div>
    <div class="card-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  image: String,
  reverse: Boolean
})
</script>

<style scoped>
.building-card {
  display: flex;
  align-items: center;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.building-card.reverse {
  flex-direction: row-reverse;
}

.card-image {
  flex: 1;
  border-radius: 15px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.5s;
}

.card-image:hover img {
  transform: scale(1.05);
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.card-content p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
}

@media (max-width: 768px) {
  .building-card,
  .building-card.reverse {
    flex-direction: column;
  }
  
  .card-image img {
    height: 250px;
  }
}
</style>
