<script setup>
import { useRoute } from 'vue-router'
import {
  PhHouse,
  PhPencilLine,
  PhTray,
  PhCalendarBlank,
  PhUsersThree,
  PhGear,
} from '@phosphor-icons/vue'
import { cn } from '@/lib/utils'

defineProps({
  menuItems: { type: Array, required: true },
  user: { type: Object, default: null },
  activity: { type: Array, default: () => [] },
})

const route = useRoute()

const iconMap = {
  PhHouse,
  PhPencilLine,
  PhTray,
  PhCalendarBlank,
  PhUsersThree,
  PhGear,
}

function isActive(item) {
  if (item.path === '/') return route.path === '/'
  return route.path.startsWith(item.path)
}
</script>

<template>
  <aside class="fixed left-0 top-0 h-screen w-sidebar bg-bg-secondary border-r border-border-default flex flex-col z-50 animate-fade-in-left">
    <!-- Logo -->
    <div class="p-6 flex items-center gap-3">
      <img src="/images/logo.svg" alt="Logo" class="w-10 h-10" />
      <div>
        <h1 class="font-semibold text-text-primary text-sm">TRXY</h1>
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] px-1.5 py-0.5 bg-accent-pink-light text-accent-pink rounded font-medium">BETA</span>
          <span class="text-[10px] text-text-muted">Version</span>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 px-4 py-2 overflow-y-auto">
      <p class="text-xs text-text-muted mb-3 px-2">Menu</p>
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.label">
          <RouterLink
            :to="item.path"
            :class="cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 group relative',
              isActive(item)
                ? 'bg-accent-primary text-bg-primary'
                : 'text-text-secondary hover:bg-accent-pink-light hover:text-text-primary'
            )"
          >
            <component
              :is="iconMap[item.icon]"
              class="w-5 h-5"
              :weight="isActive(item) ? 'fill' : 'duotone'"
            />
            <span class="text-sm font-medium flex-1">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="w-5 h-5 rounded-full text-[10px] font-medium flex items-center justify-center bg-accent-pink text-white"
            >
              {{ item.badge }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Team Activity -->
    <div v-if="activity.length" class="px-4 pb-4">
      <p class="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-3 px-2">Activity</p>
      <ul class="space-y-1">
        <li
          v-for="(entry, index) in activity"
          :key="index"
          class="flex items-start gap-2.5 px-2 py-2 rounded-xl hover:bg-bg-tertiary transition-colors duration-150"
        >
          <img
            :src="entry.avatar"
            :alt="entry.name"
            class="w-6 h-6 rounded-full object-cover mt-0.5"
          />
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-text-primary leading-snug">{{ entry.name }}</p>
            <p class="text-[11px] text-text-secondary leading-snug mt-0.5 line-clamp-2">{{ entry.action }}</p>
            <p class="text-[10px] text-text-muted mt-0.5">{{ entry.time }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- User Profile -->
    <div v-if="user" class="p-4 border-t border-border-default">
      <div class="flex items-center gap-3 hover:bg-bg-tertiary p-2 -mx-2 rounded-xl transition-colors duration-150 cursor-pointer">
        <img
          :src="user.avatar"
          :alt="user.name"
          class="w-10 h-10 rounded-full object-cover bg-border-default"
        />
        <div>
          <p class="text-sm font-semibold text-text-primary">{{ user.name }}</p>
          <p class="text-xs text-text-secondary">{{ user.role }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>
