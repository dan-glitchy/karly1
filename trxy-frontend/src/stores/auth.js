import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref({
    id: '1',
    name: 'Dan',
    avatar: '/images/profile.gif',
    handle: '@dan',
    role: 'admin',
    displayRole: 'Lead Admin',
  })

  const role = computed(() => currentUser.value.role)

  function switchRole(newRole) {
    const roleLabels = {
      admin: 'Lead Admin',
      creator: 'Lead Creator',
      poster: 'Content Poster',
    }
    currentUser.value.role = newRole
    currentUser.value.displayRole = roleLabels[newRole] || newRole
  }

  return { currentUser, role, switchRole }
})
