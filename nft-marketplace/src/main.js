import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('./views/dashboard/index.vue'),
  },
  {
    path: '/user-analytics',
    name: 'user-analytics',
    component: () => import('./views/user-analytics/index.vue'),
  },
  {
    path: '/vip-collections',
    name: 'vip-collections',
    component: () => import('./views/placeholder/index.vue'),
  },
  {
    path: '/invitation',
    name: 'invitation',
    component: () => import('./views/placeholder/index.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./views/placeholder/index.vue'),
  },
  {
    path: '/notification',
    name: 'notification',
    component: () => import('./views/placeholder/index.vue'),
  },
  {
    path: '/subscription',
    name: 'subscription',
    component: () => import('./views/placeholder/index.vue'),
  },
  {
    path: '/promotion',
    name: 'promotion',
    component: () => import('./views/placeholder/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
