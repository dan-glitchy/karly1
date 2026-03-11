<script setup>
import { ref, computed } from 'vue'
import { PhPlus } from '@phosphor-icons/vue'
import { usePostStore } from '@/stores/posts'
import PostCard from '@/components/PostCard.vue'
import { TabBar } from '@/components/ui/tab-bar'
import { Button } from '@/components/ui/button'

const postStore = usePostStore()
const activeFilter = ref('all')

const filterTabs = [
  { id: 'all', label: 'All', count: null },
  { id: 'image', label: 'Images', count: null },
  { id: 'slideshow', label: 'Slideshows', count: null },
  { id: 'reel', label: 'Reels', count: null },
]

const filteredDrafts = computed(() => {
  if (activeFilter.value === 'all') return postStore.drafts
  return postStore.drafts.filter(p => p.type === activeFilter.value)
})
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Header -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
      <div class="flex items-center justify-between mb-1">
        <h1 class="text-3xl font-bold tracking-tight text-text-primary">Create</h1>
        <Button class="gap-2">
          <PhPlus class="w-4 h-4" />
          New Post
        </Button>
      </div>
      <p class="text-sm text-text-secondary">Draft and manage your content before it hits the queue.</p>
    </section>

    <!-- Filter Tabs -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.2s">
      <TabBar v-model="activeFilter" :tabs="filterTabs" />
    </section>

    <!-- Drafts Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(post, index) in filteredDrafts"
        :key="post.id"
        class="animate-fade-in-up"
        :style="{ animationDelay: `${0.25 + index * 0.07}s` }"
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

    <!-- Empty State -->
    <div
      v-if="filteredDrafts.length === 0"
      class="text-center py-20 animate-fade-in-up"
    >
      <p class="text-text-secondary text-sm">No drafts yet. Create your first post.</p>
    </div>
  </div>
</template>
