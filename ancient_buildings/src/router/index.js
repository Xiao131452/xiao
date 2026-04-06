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
  history: createWebHistory(),
  routes
})

export default router