import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import component from '../views/throttle-page/Throttle.vue'
import Throttle from '@/views/throttle-page/Throttle.vue'
import Locomotives from '@/views/locomotives-page/locomotives.vue'
import Functions from '@/views/functions-page/functions.vue'
import Settings from '@/views/settings-page/settings.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Throttle 
  },
  {
    path: '/locomotives',
    name: 'Locomotives',
    component: Locomotives
  },
  {
    path: '/functions',
    name: 'Functions',
    component: Functions
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
