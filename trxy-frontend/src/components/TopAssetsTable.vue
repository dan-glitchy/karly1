<script setup>
import { PhCaretDown, PhCurrencyDollar } from '@phosphor-icons/vue'
import { cn } from '@/lib/utils'

defineProps({
  title: { type: String, default: 'Top Assets' },
  subtitle: { type: String, default: '' },
  items: { type: Array, required: true },
  currencyLabel: { type: String, default: 'USD' },
})

const emit = defineEmits(['currency-change'])

function formatVolume(value) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2 })
}

function formatStatus(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}
</script>

<template>
  <div class="flex-1">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <h2 class="text-2xl font-bold tracking-tight text-text-primary">{{ title }}</h2>
        <span v-if="subtitle" class="text-sm text-text-secondary">{{ subtitle }}</span>
      </div>

      <button
        class="flex items-center gap-2 px-4 py-2 bg-white border border-border-default rounded-xl hover:border-accent-pink/40 hover:bg-accent-pink-light transition-colors duration-150"
        @click="emit('currency-change')"
      >
        <span class="text-sm text-text-muted">Currency</span>
        <span class="text-sm font-medium text-text-primary">{{ currencyLabel }}</span>
        <PhCaretDown class="w-4 h-4 text-text-secondary" />
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Collections</th>
            <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Volume</th>
            <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Flow Price</th>
            <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
            <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Owners</th>
            <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Items</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            class="group hover:bg-accent-pink-light transition-colors duration-150 cursor-pointer animate-fade-in-up"
            :style="{ animationDelay: `${0.5 + index * 0.05}s` }"
          >
            <td class="py-4">
              <div class="flex items-center gap-3">
                <img
                  :src="item.avatar"
                  :alt="item.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p class="text-sm font-medium text-text-primary">{{ item.name }}</p>
                  <p class="text-xs text-text-secondary">{{ item.handle }}</p>
                </div>
              </div>
            </td>
            <td class="py-4">
              <div class="flex items-center gap-1.5">
                <PhCurrencyDollar class="w-4 h-4 text-text-secondary" weight="bold" />
                <span class="text-sm text-text-primary">{{ formatVolume(item.volume) }}</span>
              </div>
            </td>
            <td class="py-4">
              <span class="text-sm text-text-primary">{{ item.flowPrice }}</span>
            </td>
            <td class="py-4">
              <span
                :class="cn(
                  'text-sm font-medium',
                  item.status >= 0 ? 'text-success' : 'text-danger'
                )"
              >
                {{ formatStatus(item.status) }}
              </span>
            </td>
            <td class="py-4">
              <span class="text-sm text-text-primary">{{ item.owners }}</span>
            </td>
            <td class="py-4">
              <span class="text-sm text-text-primary">{{ item.items }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
