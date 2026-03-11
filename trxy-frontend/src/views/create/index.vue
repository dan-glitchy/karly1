<script setup>
import { ref, computed } from 'vue'
import { PhArrowRight, PhPlus, PhArticle } from '@phosphor-icons/vue'
import { usePostStore } from '@/stores/posts'
import { useTeamStore } from '@/stores/team'
import PostCard from '@/components/PostCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { FilterButton } from '@/components/ui/filter-button'
import { TabBar } from '@/components/ui/tab-bar'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const postStore = usePostStore()
const teamStore = useTeamStore()
const activeTab = ref('all')

const filters = [
  { label: 'Sort by', value: 'Newest' },
  { label: 'Type', value: 'All' },
  { label: 'Platform', value: 'All' },
]

const tabs = [
  { id: 'all', label: 'All Drafts', count: null },
  { id: 'image', label: 'Images', count: null },
  { id: 'slideshow', label: 'Slideshows', count: null },
  { id: 'reel', label: 'Reels', count: null },
]

const filteredDrafts = computed(() => {
  if (activeTab.value === 'all') return postStore.drafts
  return postStore.drafts.filter(p => p.type === activeTab.value)
})

const allPosts = computed(() => {
  if (activeTab.value === 'all') return postStore.posts
  return postStore.posts.filter(p => p.type === activeTab.value)
})

const recentPosts = computed(() =>
  [...postStore.posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
)

function findUser(userId) {
  return teamStore.findUser(userId)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Hero Section -->
    <section class="mb-8">
      <div class="flex items-start justify-between mb-6">
        <div class="animate-fade-in-up" style="animation-delay: 0.1s">
          <h1 class="text-[42px] leading-[1.1] tracking-tight font-extrabold text-text-primary uppercase mb-3">
            CREATE CONTENT
          </h1>
          <p class="text-sm text-text-secondary max-w-xl leading-relaxed">
            Draft and manage your content before it hits the queue. Create <span class="font-semibold text-text-primary">IMAGES, SLIDESHOWS, AND REELS</span> for your audience across all platforms.
          </p>
        </div>

        <div class="animate-fade-in-up" style="animation-delay: 0.2s">
          <Button class="gap-2">
            <PhPlus class="w-4 h-4" />
            New Post
          </Button>
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

    <!-- Card Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="(post, index) in allPosts.slice(0, 4)"
        :key="post.id"
        class="animate-fade-in-up"
        :style="{ animationDelay: `${0.2 + index * 0.1}s` }"
      >
        <PostCard
          :title="post.title"
          :type="post.type"
          :status="post.status"
          :platforms="post.platforms"
          :thumbnail="post.thumbnail"
          :created-at="post.createdAt"
        />
      </div>
    </section>

    <!-- Activity Section -->
    <section class="animate-fade-in-up" style="animation-delay: 0.4s">
      <TabBar v-model="activeTab" :tabs="tabs" class="mb-8" />

      <!-- Content Grid: Sidebar + Table -->
      <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        <!-- Sidebar Stats Card -->
        <div class="bg-white">
          <p class="text-sm text-text-secondary mb-3">
            Your Drafts <span class="text-text-muted">(Total)</span>
          </p>

          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-bg-tertiary rounded-full flex items-center justify-center">
              <PhArticle class="w-5 h-5 text-text-secondary" weight="bold" />
            </div>
            <span class="text-4xl font-bold tracking-tight text-text-primary">{{ filteredDrafts.length }}</span>
          </div>

          <p class="text-sm text-text-secondary mb-6">
            {{ postStore.ready.length }} ready · {{ postStore.queued.length }} queued
          </p>

          <button
            class="w-full py-3 px-6 bg-accent-primary text-white font-medium rounded-full hover:opacity-90 active:scale-[0.98] transition-all duration-150"
          >
            Create New Draft
          </button>
        </div>

        <!-- Recent Posts Table -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <h2 class="text-2xl font-bold tracking-tight text-text-primary">Recent Posts</h2>
              <span class="text-sm text-text-secondary">{{ postStore.posts.length }} Total</span>
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
                  <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(post, index) in recentPosts"
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
                    <span class="text-sm text-text-secondary">{{ formatDate(post.createdAt) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
