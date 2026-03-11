<script setup>
import { ref, computed } from 'vue'
import { PhArrowRight } from '@phosphor-icons/vue'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import { useTeamStore } from '@/stores/team'
import StatusBadge from '@/components/StatusBadge.vue'
import { FilterButton } from '@/components/ui/filter-button'
import { TabBar } from '@/components/ui/tab-bar'
import { Button } from '@/components/ui/button'

const postStore = usePostStore()
const auth = useAuthStore()
const teamStore = useTeamStore()
const activeTab = ref('all')

const filters = [
  { label: 'Sort by', value: 'Scheduled' },
  { label: 'Status', value: 'All' },
  { label: 'Platform', value: 'All' },
]

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

const isReadOnly = computed(() => auth.role === 'creator')

function findUser(userId) {
  return teamStore.findUser(userId)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function handleClaim(postId) {
  postStore.claimPost(postId)
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Hero Section -->
    <section class="mb-8">
      <div class="flex items-start justify-between mb-6">
        <div class="animate-fade-in-up" style="animation-delay: 0.1s">
          <h1 class="text-[42px] leading-[1.1] tracking-tight font-extrabold text-text-primary uppercase mb-3">
            CONTENT QUEUE
          </h1>
          <p class="text-sm text-text-secondary max-w-xl leading-relaxed">
            Manage content ready for posting. <span class="font-semibold text-text-primary">CLAIM, SCHEDULE, AND PUBLISH</span> across all your platforms from one place.
          </p>
        </div>

        <div class="animate-fade-in-up" style="animation-delay: 0.2s">
          <a
            href="#"
            class="group flex items-center gap-2 text-sm font-medium text-text-primary hover:text-accent-primary transition-colors duration-200"
          >
            EXPLORE ALL
            <PhArrowRight class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3 animate-fade-in-up" style="animation-delay: 0.3s">
        <FilterButton
          v-for="filter in filters"
          :key="filter.label"
          :label="filter.label"
          :value="filter.value"
        />
      </div>
    </section>

    <!-- Activity Section -->
    <section class="animate-fade-in-up" style="animation-delay: 0.4s">
      <TabBar v-model="activeTab" :tabs="tabs" class="mb-8" />

      <!-- Queue Table -->
      <div class="flex-1">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-bold tracking-tight text-text-primary">Queue Items</h2>
            <span class="text-sm text-text-secondary">{{ filteredPosts.length }} Posts</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left">
                <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Post</th>
                <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Type</th>
                <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Creator</th>
                <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Scheduled</th>
                <th v-if="!isReadOnly" class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(post, index) in filteredPosts"
                :key="post.id"
                class="group hover:bg-accent-pink-light transition-colors duration-150 cursor-pointer animate-fade-in-up"
                :style="{ animationDelay: `${0.5 + index * 0.05}s` }"
              >
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="post.thumbnail"
                      :alt="post.title"
                      class="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p class="text-sm font-medium text-text-primary">{{ post.title }}</p>
                      <p class="text-xs text-text-secondary">{{ post.platforms.join(', ') }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4">
                  <span class="text-sm text-text-primary capitalize">{{ post.type }}</span>
                </td>
                <td class="py-4">
                  <StatusBadge :status="post.status" />
                </td>
                <td class="py-4">
                  <div class="flex items-center gap-2">
                    <img
                      :src="findUser(post.createdBy).avatar"
                      :alt="findUser(post.createdBy).name"
                      class="w-6 h-6 rounded-full object-cover"
                    />
                    <span class="text-sm text-text-primary">{{ findUser(post.createdBy).name }}</span>
                  </div>
                </td>
                <td class="py-4">
                  <span class="text-sm text-text-secondary">{{ formatDate(post.scheduledFor) }}</span>
                </td>
                <td v-if="!isReadOnly" class="py-4">
                  <Button
                    v-if="post.status === 'ready'"
                    size="sm"
                    variant="outline"
                    class="text-xs"
                    @click="handleClaim(post.id)"
                  >
                    Claim
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredPosts.length === 0" class="text-center py-16">
          <p class="text-text-secondary text-sm">No posts in this category.</p>
        </div>
      </div>
    </section>
  </div>
</template>
