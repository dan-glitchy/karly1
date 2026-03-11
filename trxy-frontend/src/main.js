import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import './style.css'

const pinia = createPinia()

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('./views/dashboard/index.vue'),
    meta: { roles: ['admin', 'creator', 'poster'] },
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('./views/create/index.vue'),
    meta: { roles: ['admin', 'creator'] },
  },
  {
    path: '/queue',
    name: 'queue',
    component: () => import('./views/queue/index.vue'),
    meta: { roles: ['admin', 'creator', 'poster'] },
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('./views/calendar/index.vue'),
    meta: { roles: ['admin', 'poster'] },
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('./views/team/index.vue'),
    meta: { roles: ['admin'] },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./views/settings/index.vue'),
    meta: { roles: ['admin', 'creator', 'poster'] },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore(pinia)
  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return { path: '/' }
  }
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
