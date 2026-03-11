<script setup>
import { ref, computed } from 'vue'
import {
  PhImage,
  PhImages,
  PhFilmStrip,
  PhCamera,
  PhMusicNote,
  PhMonitorPlay,
} from '@phosphor-icons/vue'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import { teamMembers } from '@/lib/data'
import { TabBar } from '@/components/ui/tab-bar'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/StatusBadge.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const postStore = usePostStore()
const auth = useAuthStore()
const activeTab = ref('all')

const tabs = [
  { id: 'all', label: 'All', count: null },
  { id: 'ready', label: 'Ready', count: null },
  { id: 'queued', label: 'Queued', count: null },
  { id: 'posted', label: 'Posted', count: null },
]

const filteredPosts = computed(() => {
  const items = postStore.queueItems
  if (activeTab.value === 'all') return items
  return items.filter(p => p.status === activeTab.value)
})

const typeIcons = { image: PhImage, slideshow: PhImages, reel: PhFilmStrip }
const platformIcons = {
  instagram: PhCamera,
  tiktok: PhMusicNote,
  youtube: PhMonitorPlay,
}

function findUser(userId) {
  return teamMembers.find(m => m.id === userId) || { name: 'Unknown' }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const isReadOnly = computed(() => auth.role === 'creator')

function handleClaim(postId) {
  postStore.claimPost(postId)
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Header -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
      <h1 class="text-3xl font-bold tracking-tight text-text-primary mb-1">Queue</h1>
      <p class="text-sm text-text-secondary">Manage content ready for posting across platforms.</p>
    </section>

    <!-- Tabs -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.2s">
      <TabBar v-model="activeTab" :tabs="tabs" />
    </section>

    <!-- Table -->
    <section class="animate-fade-in-up" style="animation-delay: 0.3s">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[60px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead v-if="!isReadOnly" class="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(post, index) in filteredPosts"
            :key="post.id"
            class="animate-fade-in-up cursor-pointer"
            :style="{ animationDelay: `${0.35 + index * 0.04}s` }"
          >
            <TableCell>
              <img
                :src="post.thumbnail"
                :alt="post.title"
                class="w-10 h-10 rounded-lg object-cover"
              />
            </TableCell>
            <TableCell class="font-medium text-text-primary">{{ post.title }}</TableCell>
            <TableCell>
              <div class="flex items-center gap-1.5">
                <component :is="typeIcons[post.type]" class="w-4 h-4 text-text-secondary" weight="duotone" />
                <span class="text-sm text-text-secondary capitalize">{{ post.type }}</span>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-1">
                <component
                  v-for="p in post.platforms"
                  :key="p"
                  :is="platformIcons[p]"
                  class="w-4 h-4 text-text-muted"
                  weight="duotone"
                />
              </div>
            </TableCell>
            <TableCell class="text-sm text-text-secondary">
              {{ findUser(post.createdBy).name }}
            </TableCell>
            <TableCell>
              <StatusBadge :status="post.status" />
            </TableCell>
            <TableCell class="text-sm text-text-secondary">
              {{ formatDate(post.scheduledFor) }}
            </TableCell>
            <TableCell v-if="!isReadOnly">
              <Button
                v-if="post.status === 'ready'"
                size="sm"
                variant="outline"
                class="text-xs"
                @click="handleClaim(post.id)"
              >
                Claim
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div v-if="filteredPosts.length === 0" class="text-center py-16">
        <p class="text-text-secondary text-sm">No posts in this category.</p>
      </div>
    </section>
  </div>
</template>
