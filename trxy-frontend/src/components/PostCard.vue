<script setup>
import {
  PhImage,
  PhImages,
  PhFilmStrip,
  PhCamera,
  PhMusicNote,
  PhMonitorPlay,
} from '@phosphor-icons/vue'
import StatusBadge from '@/components/StatusBadge.vue'

defineProps({
  title: String,
  type: String,
  status: String,
  platforms: { type: Array, default: () => [] },
  thumbnail: String,
  createdAt: String,
})

const typeIcons = { image: PhImage, slideshow: PhImages, reel: PhFilmStrip }
const typeLabels = { image: 'Image', slideshow: 'Slideshow', reel: 'Reel' }
const platformIcons = {
  instagram: PhCamera,
  tiktok: PhMusicNote,
  youtube: PhMonitorPlay,
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-border-default overflow-hidden shadow-card hover:shadow-card-hover hover:border-accent-pink/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
    <!-- Thumbnail -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="thumbnail"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <StatusBadge :status="status" class="absolute top-3 right-3" />
    </div>

    <!-- Content -->
    <div class="p-4">
      <p class="text-sm font-medium text-text-primary mb-2 truncate">{{ title }}</p>

      <div class="flex items-center justify-between">
        <!-- Type -->
        <div class="flex items-center gap-1.5">
          <component :is="typeIcons[type]" class="w-4 h-4 text-text-secondary" weight="duotone" />
          <span class="text-xs text-text-secondary">{{ typeLabels[type] || type }}</span>
        </div>

        <!-- Platforms -->
        <div class="flex items-center gap-1">
          <component
            v-for="p in platforms"
            :key="p"
            :is="platformIcons[p]"
            class="w-3.5 h-3.5 text-text-muted"
            weight="duotone"
          />
        </div>
      </div>

      <p v-if="createdAt" class="text-[10px] text-text-muted mt-2">{{ formatDate(createdAt) }}</p>
    </div>
  </div>
</template>
