<script setup>
import { ref, onMounted } from 'vue'
import { PhCurrencyDollar } from '@phosphor-icons/vue'

const props = defineProps({
  balance: { type: Number, default: 0 },
  label: { type: String, default: 'Your Balance' },
  sublabel: { type: String, default: 'Volume' },
  address: { type: String, default: '' },
  actionLabel: { type: String, default: 'Check Transactions' },
})

const emit = defineEmits(['action'])

const displayValue = ref('0.00')

onMounted(() => {
  const duration = 1500
  const startTime = performance.now()

  function animate(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayValue.value = (props.balance * eased).toFixed(2)
    if (progress < 1) requestAnimationFrame(animate)
  }

  setTimeout(() => requestAnimationFrame(animate), 300)
})
</script>

<template>
  <div class="bg-white">
    <p class="text-sm text-text-secondary mb-3">
      {{ label }} <span v-if="sublabel" class="text-text-muted">({{ sublabel }})</span>
    </p>

    <div class="flex items-center gap-3 mb-2">
      <div class="w-10 h-10 bg-bg-tertiary rounded-full flex items-center justify-center">
        <slot name="icon">
          <PhCurrencyDollar class="w-5 h-5 text-text-secondary" weight="bold" />
        </slot>
      </div>
      <span class="text-4xl font-bold tracking-tight text-text-primary">{{ displayValue }}</span>
    </div>

    <p v-if="address" class="text-sm text-text-secondary mb-6">
      Your Address: <span class="text-text-primary">{{ address }}</span>
    </p>

    <button
      class="w-full py-3 px-6 bg-accent-primary text-white font-medium rounded-full hover:opacity-90 active:scale-[0.98] transition-all duration-150"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
