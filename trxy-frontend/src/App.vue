<script setup>
import { computed } from 'vue'
import SidebarNav from './components/layout/SidebarNav.vue'
import { menuItems, activityFeed } from '@/lib/data'
import { useAuthStore } from '@/stores/auth'
import { useTeamStore } from '@/stores/team'

const auth = useAuthStore()
const teamStore = useTeamStore()

const filteredMenuItems = computed(() =>
  menuItems.filter(item => item.roles.includes(auth.role))
)

const user = computed(() => ({
  name: auth.currentUser.name,
  role: auth.currentUser.displayRole,
  avatar: auth.currentUser.avatar,
}))

const activity = computed(() =>
  activityFeed.slice(0, 4).map(entry => {
    const member = teamStore.findUser(entry.userId)
    return { ...entry, name: member.name, avatar: member.avatar }
  })
)
</script>

<template>
  <div class="min-h-screen bg-white">
    <SidebarNav :menu-items="filteredMenuItems" :user="user" :activity="activity" />
    <main class="ml-sidebar min-h-screen">
      <router-view />
    </main>
  </div>
</template>
