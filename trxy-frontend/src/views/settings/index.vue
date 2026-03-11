<script setup>
import { computed } from 'vue'
import { PhCamera, PhMusicNote, PhMonitorPlay } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import AvatarPicker from '@/components/AvatarPicker.vue'

const auth = useAuthStore()

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: PhCamera, connected: true },
  { id: 'tiktok', label: 'TikTok', icon: PhMusicNote, connected: true },
  { id: 'youtube', label: 'YouTube', icon: PhMonitorPlay, connected: false },
]

const roles = ['admin', 'creator', 'poster']
const activeRole = computed(() => auth.role)
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Header -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
      <h1 class="text-3xl font-bold tracking-tight text-text-primary mb-1">Settings</h1>
      <p class="text-sm text-text-secondary">Manage your profile, platforms, and preferences.</p>
    </section>

    <!-- Profile -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.2s">
      <h2 class="text-lg font-semibold text-text-primary mb-4">Profile</h2>
      <div class="flex items-center gap-4 p-4 bg-white border border-border-default rounded-2xl">
        <AvatarPicker />
        <div>
          <p class="text-lg font-semibold text-text-primary">{{ auth.currentUser.name }}</p>
          <p class="text-sm text-text-secondary">{{ auth.currentUser.handle }}</p>
          <p class="text-xs text-text-muted capitalize">{{ auth.currentUser.displayRole }}</p>
        </div>
      </div>
    </section>

    <Separator class="mb-8" />

    <!-- Connected Platforms -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.3s">
      <h2 class="text-lg font-semibold text-text-primary mb-4">Connected Platforms</h2>
      <div class="space-y-3">
        <div
          v-for="platform in platforms"
          :key="platform.id"
          class="flex items-center justify-between p-4 bg-white border border-border-default rounded-2xl"
        >
          <div class="flex items-center gap-3">
            <component :is="platform.icon" class="w-6 h-6 text-text-primary" weight="duotone" />
            <span class="text-sm font-medium text-text-primary">{{ platform.label }}</span>
          </div>
          <span
            class="text-xs font-medium px-2.5 py-1 rounded-full"
            :class="platform.connected ? 'bg-success/10 text-success' : 'bg-bg-tertiary text-text-muted'"
          >
            {{ platform.connected ? 'Connected' : 'Not Connected' }}
          </span>
        </div>
      </div>
    </section>

    <Separator class="mb-8" />

    <!-- Role Switcher (Dev Tool) -->
    <section class="animate-fade-in-up" style="animation-delay: 0.4s">
      <h2 class="text-lg font-semibold text-text-primary mb-1">Role Switcher</h2>
      <p class="text-xs text-text-muted mb-4">Dev tool — switch roles to preview different access levels.</p>
      <div class="flex items-center gap-3">
        <Button
          v-for="r in roles"
          :key="r"
          :variant="activeRole === r ? 'default' : 'outline'"
          size="sm"
          class="capitalize"
          @click="auth.switchRole(r)"
        >
          {{ r }}
        </Button>
      </div>
    </section>
  </div>
</template>
