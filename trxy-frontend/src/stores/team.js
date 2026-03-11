import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { users as initialUsers } from '@/lib/data'

export const useTeamStore = defineStore('team', () => {
  const members = ref([...initialUsers])

  function findUser(userId) {
    return members.value.find(m => m.id === userId) || { name: 'Unknown', avatar: '/images/avatar_10.gif' }
  }

  const active = computed(() => members.value.filter(m => m.status === 'active'))

  return { members, findUser, active }
})
