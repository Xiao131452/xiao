import { createRouter, createWebHistory } from 'vue-router'
import Intro from '../views/Intro.vue'
import Game from '../views/Game.vue'
import MapView from '../views/MapView.vue'
import PanoramaView from '../views/PanoramaView.vue'
import TestDataLoad from '../views/TestDataLoad.vue'

const routes = [
  {
    path: '/',
    name: 'MapView',
    component: MapView
  },
  {
    path: '/intro',
    name: 'Intro',
    component: Intro
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/panorama',
    name: 'PanoramaView',
    component: PanoramaView
  },
  {
    path: '/test-data',
    name: 'TestDataLoad',
    component: TestDataLoad
  }
]

const router = createRouter({
  // 让路由基路径跟随 Vite base，适配 GitHub Pages 项目页 /xiao/
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router