<script setup>
import { useRoute } from 'vue-router'
import {
  PhCrown,
  PhHouse,
  PhPencilLine,
  PhTray,
  PhCalendarBlank,
  PhUsersThree,
  PhGear,
  PhSealCheck,
} from '@phosphor-icons/vue'
import { cn } from '@/lib/utils'

defineProps({
  menuItems: { type: Array, required: true },
  user: { type: Object, default: null },
  promo: { type: Object, default: null },
})

const route = useRoute()

const iconMap = {
  PhHouse,
  PhPencilLine,
  PhTray,
  PhCalendarBlank,
  PhUsersThree,
  PhGear,
  PhCrown,
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
                ? 'bg-accent-primary text-white'
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

    <!-- Promo Card -->
    <div v-if="promo" class="px-4 pb-4">
      <div class="bg-white rounded-2xl border border-border-default overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-200">
        <div class="relative h-32 overflow-hidden">
          <img
            :src="promo.image"
            :alt="promo.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-3">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center">
              <PhCrown class="w-3 h-3 text-white" weight="fill" />
            </div>
            <span class="text-sm font-semibold text-text-primary">{{ promo.title }}</span>
            <PhSealCheck v-if="promo.verified" class="w-5 h-5 text-success ml-auto" weight="fill" />
          </div>
          <div class="flex items-center justify-between text-xs text-text-secondary">
            <span>{{ promo.count }}</span>
            <span class="font-medium text-text-primary">{{ promo.rating }} <span class="text-text-muted font-normal">Rating</span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- User Profile -->
    <div v-if="user" class="p-4 border-t border-border-default">
      <div class="flex items-center gap-3 hover:bg-bg-tertiary p-2 -mx-2 rounded-xl transition-colors duration-150 cursor-pointer">
        <img
          :src="user.avatar"
          :alt="user.name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p class="text-sm font-semibold text-text-primary">{{ user.name }}</p>
          <p class="text-xs text-text-secondary">{{ user.role }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>
