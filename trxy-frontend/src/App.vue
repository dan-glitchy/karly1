<script setup>
import SidebarNav from './components/layout/SidebarNav.vue'
import { menuItems } from '@/lib/data'

const user = {
  name: 'Dan',
  role: 'Lead Visual Designer',
  avatar: '/images/asset_6.jpg',
}

const promo = {
  image: '/images/asset_5.jpg',
  title: 'TRXY Collection',
  verified: true,
  count: '9.2K Pieces',
  rating: '9.6/10',
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <SidebarNav :menu-items="menuItems" :user="user" :promo="promo" />
    <main class="ml-sidebar min-h-screen">
      <router-view />
    </main>
  </div>
</template>
