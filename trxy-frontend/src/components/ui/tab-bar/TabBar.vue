<script setup>
const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex items-center gap-6 border-b border-border-default">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="relative pb-3 text-sm font-medium transition-colors duration-150"
      :class="modelValue === tab.id ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'"
      @click="emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
      <span v-if="tab.count != null" class="ml-1 text-text-muted">({{ tab.count }})</span>
      <div
        v-if="modelValue === tab.id"
        class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-pink"
      />
    </button>
  </div>
</template>
