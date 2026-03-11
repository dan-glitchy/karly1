<script setup>
import { useRoute } from 'vue-router'
import { PhHourglass } from '@phosphor-icons/vue'

const route = useRoute()

const nameMap = {
  'vip-collections': 'VIP Collections',
  'invitation': 'Invitation',
  'settings': 'Settings',
  'notification': 'Notification',
  'subscription': 'Subscription',
  'promotion': 'Promotion',
}

const title = nameMap[route.name] || route.name
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div class="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center mb-6">
        <PhHourglass class="w-8 h-8 text-text-muted" weight="duotone" />
      </div>
      <h1 class="text-2xl font-bold text-text-primary mb-2">{{ title }}</h1>
      <p class="text-sm text-text-secondary max-w-md">
        This section is coming soon. We're working on building out the {{ title.toLowerCase() }} experience.
      </p>
    </div>
  </div>
</template>
