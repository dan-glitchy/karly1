<script setup>
import { ref, computed } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuthStore } from '@/stores/auth'
import { useTeamStore } from '@/stores/team'

const auth = useAuthStore()
const teamStore = useTeamStore()
const open = ref(false)

const pickerGifs = Array.from({ length: 32 }, (_, i) => `/images/picker/pick_${i + 1}.gif`)
const memberAvatars = computed(() =>
  [...new Set(teamStore.members.map(m => m.avatar))]
)
const avatarOptions = computed(() =>
  [...new Set([...memberAvatars.value, ...pickerGifs])]
)

function selectAvatar(src) {
  auth.currentUser.avatar = src
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <button class="relative group cursor-pointer rounded-full focus:outline-none">
        <img
          :src="auth.currentUser.avatar"
          :alt="auth.currentUser.name"
          class="w-16 h-16 rounded-full object-cover bg-bg-tertiary transition-opacity duration-150 group-hover:opacity-75"
        />
        <div class="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <span class="text-[10px] font-medium text-bg-primary bg-accent-primary/80 backdrop-blur-sm px-2 py-1 rounded-full">Edit</span>
        </div>
      </button>
    </PopoverTrigger>
    <PopoverContent
      side="right"
      :side-offset="12"
      align="start"
      class="w-[280px] p-0 rounded-2xl border border-border-default shadow-card-hover bg-bg-card"
    >
      <div class="p-3 border-b border-border-default">
        <p class="text-xs font-medium text-text-primary">Choose Avatar</p>
        <p class="text-[10px] text-text-muted mt-0.5">Pick something cool</p>
      </div>
      <div class="p-3 max-h-[320px] overflow-y-auto">
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="src in avatarOptions"
            :key="src"
            class="w-full aspect-square rounded-xl overflow-hidden bg-border-default hover:ring-2 hover:ring-accent-pink hover:scale-105 transition-all duration-150 cursor-pointer"
            :class="auth.currentUser.avatar === src ? 'ring-2 ring-accent-primary' : ''"
            @click="selectAvatar(src)"
          >
            <img :src="src" alt="Avatar option" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
