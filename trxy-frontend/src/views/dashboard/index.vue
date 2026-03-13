<script setup>
import { computed } from 'vue'
import {
  PhArrowRight,
  PhTrendUp,
  PhTrendDown,
  PhArticle,
  PhTray,
  PhCheckCircle,
} from '@phosphor-icons/vue'
import { activityFeed } from '@/lib/data'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import { useTeamStore } from '@/stores/team'
import PostCard from '@/components/PostCard.vue'
import ThreeRoseViewer from '@/components/ThreeRoseViewer.vue'

const postStore = usePostStore()
const auth = useAuthStore()
const teamStore = useTeamStore()

const stats = computed(() => [
  {
    label: 'Total Posts',
    value: postStore.posts.length.toString(),
    change: '+12.5%',
    trend: 'up',
    icon: 'PhArticle',
  },
  {
    label: 'Queued',
    value: postStore.queued.length.toString(),
    change: '+3',
    trend: 'up',
    icon: 'PhTray',
  },
  {
    label: 'Total Posted',
    value: postStore.posted.length.toString(),
    change: '+8.2%',
    trend: 'up',
    icon: 'PhCheckCircle',
  },
])

const iconMap = { PhArticle, PhTray, PhCheckCircle }

const recentPosts = computed(() =>
  [...postStore.posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)
)

function findUser(userId) {
  return teamStore.findUser(userId)
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Welcome Header -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
      <h1 class="text-3xl font-bold tracking-tight text-text-primary mb-1">
        Welcome back, {{ auth.currentUser.name }}
      </h1>
      <p class="text-sm text-text-secondary">
        Here's what's happening with your content today.
      </p>
    </section>

    <!-- Stats Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_140px] gap-5 mb-10">
      <div
        v-for="(stat, index) in stats"
        :key="stat.label"
        class="bg-bg-card border border-border-default rounded-2xl p-5 hover:shadow-card-hover hover:border-accent-pink/30 transition-all duration-200 animate-fade-in-up"
        :style="{ animationDelay: `${0.15 + index * 0.05}s` }"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-bg-tertiary rounded-xl flex items-center justify-center">
            <component :is="iconMap[stat.icon]" class="w-5 h-5 text-text-secondary" weight="duotone" />
          </div>
          <span
            class="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
            :class="stat.trend === 'up'
              ? 'text-success bg-success/10'
              : 'text-danger bg-danger/10'"
          >
            <PhTrendUp v-if="stat.trend === 'up'" class="w-3 h-3" />
            <PhTrendDown v-else class="w-3 h-3" />
            {{ stat.change }}
          </span>
        </div>
        <p class="text-2xl font-bold text-text-primary mb-1">{{ stat.value }}</p>
        <p class="text-xs text-text-muted">{{ stat.label }}</p>
      </div>
      <div
        class="overflow-hidden animate-fade-in-up min-h-[140px]"
        :style="{ animationDelay: '0.3s' }"
      >
        <ThreeRoseViewer />
      </div>
    </section>

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
      <!-- Recent Posts -->
      <section class="animate-fade-in-up" style="animation-delay: 0.3s">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-text-primary">Recent Posts</h2>
          <RouterLink
            to="/queue"
            class="group flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            View all
            <PhArrowRight class="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div
            v-for="(post, index) in recentPosts"
            :key="post.id"
            class="animate-fade-in-up"
            :style="{ animationDelay: `${0.35 + index * 0.07}s` }"
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
        </div>
      </section>

      <!-- Right Column -->
      <div class="space-y-8">
        <!-- Quick Actions -->
        <section class="bg-bg-actions rounded-2xl p-6 text-text-on-actions animate-fade-in-up" style="animation-delay: 0.3s">
          <p class="text-sm text-text-on-actions/60 mb-1">Quick Actions</p>
          <p class="text-xl font-bold tracking-tight mb-4">{{ postStore.ready.length }} posts ready</p>
          <p class="text-sm text-text-on-actions/60 mb-5">{{ postStore.queued.length }} in queue</p>
          <div class="grid grid-cols-2 gap-3">
            <RouterLink
              to="/create"
              class="py-2.5 bg-bg-primary text-text-primary font-medium text-sm rounded-xl hover:opacity-90 transition-colors text-center"
            >
              New Post
            </RouterLink>
            <RouterLink
              to="/queue"
              class="py-2.5 bg-text-on-actions/15 text-text-on-actions font-medium text-sm rounded-xl hover:bg-text-on-actions/25 transition-colors text-center"
            >
              View Queue
            </RouterLink>
          </div>
        </section>

        <!-- Team Activity -->
        <section class="animate-fade-in-up" style="animation-delay: 0.4s">
          <h2 class="text-xl font-bold text-text-primary mb-5">Team Activity</h2>
          <ul class="space-y-4">
            <li
              v-for="(activity, index) in activityFeed"
              :key="index"
              class="flex items-center gap-3 animate-fade-in-up"
              :style="{ animationDelay: `${0.45 + index * 0.05}s` }"
            >
              <img
                :src="findUser(activity.userId).avatar"
                :alt="findUser(activity.userId).name"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-text-primary">
                  <span class="font-medium">{{ findUser(activity.userId).name }}</span>
                </p>
                <p class="text-xs text-text-secondary truncate">{{ activity.action }}</p>
              </div>
              <span class="text-xs text-text-muted whitespace-nowrap">{{ activity.time }}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
