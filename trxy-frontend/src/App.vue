<script setup>
import { computed } from 'vue'
import SidebarNav from './components/layout/SidebarNav.vue'
import { menuItems } from '@/lib/data'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const filteredMenuItems = computed(() =>
  menuItems.filter(item => item.roles.includes(auth.role))
)

const user = computed(() => ({
  name: auth.currentUser.name,
  role: auth.currentUser.displayRole,
  avatar: auth.currentUser.avatar,
}))

const promo = {
  image: '/images/asset_5.jpg',
  title: 'TRXY Studio',
  verified: true,
  count: '9 Posts Queued',
  rating: '5 Active',
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <SidebarNav :menu-items="filteredMenuItems" :user="user" :promo="promo" />
    <main class="ml-sidebar min-h-screen">
      <router-view />
    </main>
  </div>
</template>
