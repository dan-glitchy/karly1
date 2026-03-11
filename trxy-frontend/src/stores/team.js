import { defineStore } from 'pinia'
import { ref } from 'vue'
import { teamMembers as initialMembers } from '@/lib/data'

export const useTeamStore = defineStore('team', () => {
  const members = ref([...initialMembers])
  return { members }
})
