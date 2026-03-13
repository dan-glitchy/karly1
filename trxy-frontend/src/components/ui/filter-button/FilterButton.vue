<script setup>
import { PhCaretDown } from '@phosphor-icons/vue'

defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    class="flex items-center gap-3 px-4 py-2.5 bg-bg-card border border-border-default rounded-xl hover:border-accent-pink/40 hover:bg-accent-pink-light transition-colors duration-150"
    @click="emit('click')"
  >
    <span class="text-sm text-text-muted">{{ label }}</span>
    <span class="text-sm font-medium text-text-primary">{{ value }}</span>
    <PhCaretDown class="w-4 h-4 text-text-secondary" />
  </button>
</template>
