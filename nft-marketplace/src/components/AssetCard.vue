<script setup>
import { PhGlobe, PhSealCheck, PhCurrencyDollar } from '@phosphor-icons/vue'

defineProps({
  image: String,
  collection: String,
  tokenId: String,
  price: Number,
  rating: Number,
})
</script>

<template>
  <div class="bg-white rounded-2xl border border-border-default overflow-hidden shadow-card hover:shadow-card-hover hover:border-accent-pink/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
    <!-- Image -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="image"
        :alt="`${collection} ${tokenId}`"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Collection -->
      <div class="flex items-center gap-2 mb-3">
        <div class="w-6 h-6 rounded-full border border-border-default flex items-center justify-center">
          <PhGlobe class="w-3.5 h-3.5 text-text-secondary" weight="duotone" />
        </div>
        <span class="text-sm font-medium text-text-primary">
          {{ collection }} <span class="text-text-secondary">{{ tokenId }}</span>
        </span>
        <PhSealCheck class="w-5 h-5 text-success ml-auto" weight="fill" />
      </div>

      <!-- Price & Rating -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <PhCurrencyDollar class="w-4 h-4 text-text-secondary" weight="bold" />
          <span class="text-sm font-medium text-text-primary">{{ price }}</span>
          <span class="text-sm text-text-secondary">Ethereum</span>
        </div>
        <div class="text-sm">
          <span class="font-semibold text-text-primary">{{ rating }}</span>
          <span class="text-text-muted">/10 Rating</span>
        </div>
      </div>
    </div>
  </div>
</template>
