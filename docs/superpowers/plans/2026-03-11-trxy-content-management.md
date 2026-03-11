# TRXY Content Management Tool — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the TRXY frontend from an NFT marketplace into an internal content management tool for managing creators, posts, and multi-platform publishing queues.

**Architecture:** Incremental repurpose — keep the existing App shell, sidebar, UI primitives, and design system. Replace mock data and domain components. Add Pinia stores for auth/posts/team. Add 5 new view pages following existing layout patterns.

**Tech Stack:** Vue 3 (`<script setup>`), Vite 7, Tailwind CSS v4, Pinia 3, shadcn-vue (new-york), @phosphor-icons/vue, @tanstack/vue-table

**Spec:** `docs/superpowers/specs/2026-03-11-trxy-content-management-design.md`

**Note:** No test runner is configured in this project. Verification is done via `npm run build` (no compile errors) and visual inspection with `npm run dev`.

---

## Chunk 1: Foundation (Stores + Data + Routing)

### Task 1: Create auth store

**Files:**
- Create: `src/stores/auth.js`

- [ ] **Step 1: Create `src/stores/auth.js`**

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref({
    id: '1',
    name: 'Dan',
    avatar: '/images/asset_6.jpg',
    handle: '@dan',
    role: 'admin',
    displayRole: 'Lead Admin',
  })

  const role = computed(() => currentUser.value.role)

  function switchRole(newRole) {
    const roleLabels = {
      admin: 'Lead Admin',
      creator: 'Lead Creator',
      poster: 'Content Poster',
    }
    currentUser.value.role = newRole
    currentUser.value.displayRole = roleLabels[newRole] || newRole
  }

  return { currentUser, role, switchRole }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/auth.js
git commit -m "feat: add auth store with role switching"
```

---

### Task 2: Create posts store

**Files:**
- Create: `src/stores/posts.js`

- [ ] **Step 1: Create `src/stores/posts.js`**

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { posts as initialPosts } from '@/lib/data'
import { useAuthStore } from './auth'

export const usePostStore = defineStore('posts', () => {
  const posts = ref([...initialPosts])

  const drafts = computed(() => posts.value.filter(p => p.status === 'draft'))
  const ready = computed(() => posts.value.filter(p => p.status === 'ready'))
  const queued = computed(() => posts.value.filter(p => p.status === 'queued'))
  const posted = computed(() => posts.value.filter(p => p.status === 'posted'))
  const queueItems = computed(() => posts.value.filter(p => p.status !== 'draft'))

  const byType = (type) => posts.value.filter(p => p.type === type)

  function claimPost(postId) {
    const auth = useAuthStore()
    const post = posts.value.find(p => p.id === postId)
    if (post && post.status === 'ready') {
      post.assignedTo = auth.currentUser.id
      post.status = 'queued'
    }
  }

  return { posts, drafts, ready, queued, posted, queueItems, byType, claimPost }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/posts.js
git commit -m "feat: add posts store with status getters and claim action"
```

---

### Task 3: Create team store

**Files:**
- Create: `src/stores/team.js`

- [ ] **Step 1: Create `src/stores/team.js`**

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { teamMembers as initialMembers } from '@/lib/data'

export const useTeamStore = defineStore('team', () => {
  const members = ref([...initialMembers])
  return { members }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/team.js
git commit -m "feat: add team store"
```

---

### Task 4: Replace mock data in `data.js`

**Files:**
- Modify: `src/lib/data.js` (full rewrite)

- [ ] **Step 1: Rewrite `src/lib/data.js`**

Replace all NFT/asset data with TRXY content management data. The file exports: `posts`, `teamMembers`, `menuItems`, `activityFeed`.

```js
export const posts = [
  {
    id: '1',
    title: 'Summer Vibes Collection',
    type: 'slideshow',
    status: 'posted',
    platforms: ['instagram', 'tiktok'],
    thumbnail: '/images/asset_1.jpg',
    createdBy: '2',
    createdAt: '2026-03-10T14:30:00Z',
    scheduledFor: '2026-03-10T18:00:00Z',
    assignedTo: '4',
    platform: 'instagram',
  },
  {
    id: '2',
    title: 'Product Launch Teaser',
    type: 'reel',
    status: 'queued',
    platforms: ['instagram', 'tiktok', 'youtube'],
    thumbnail: '/images/asset_2.jpg',
    createdBy: '3',
    createdAt: '2026-03-09T10:00:00Z',
    scheduledFor: '2026-03-12T12:00:00Z',
    assignedTo: '4',
    platform: 'tiktok',
  },
  {
    id: '3',
    title: 'Behind the Scenes',
    type: 'image',
    status: 'ready',
    platforms: ['instagram'],
    thumbnail: '/images/asset_3.jpg',
    createdBy: '2',
    createdAt: '2026-03-08T16:45:00Z',
    scheduledFor: null,
    assignedTo: null,
    platform: null,
  },
  {
    id: '4',
    title: 'Weekly Roundup #12',
    type: 'slideshow',
    status: 'ready',
    platforms: ['instagram', 'tiktok'],
    thumbnail: '/images/asset_4.jpg',
    createdBy: '3',
    createdAt: '2026-03-08T09:20:00Z',
    scheduledFor: null,
    assignedTo: null,
    platform: null,
  },
  {
    id: '5',
    title: 'New Feature Spotlight',
    type: 'reel',
    status: 'draft',
    platforms: ['tiktok', 'youtube'],
    thumbnail: '/images/asset_5.jpg',
    createdBy: '2',
    createdAt: '2026-03-07T11:00:00Z',
    scheduledFor: null,
    assignedTo: null,
    platform: null,
  },
  {
    id: '6',
    title: 'Team Introduction',
    type: 'reel',
    status: 'draft',
    platforms: ['instagram', 'tiktok'],
    thumbnail: '/images/asset_7.jpg',
    createdBy: '3',
    createdAt: '2026-03-07T08:30:00Z',
    scheduledFor: null,
    assignedTo: null,
    platform: null,
  },
  {
    id: '7',
    title: 'Style Guide Preview',
    type: 'image',
    status: 'draft',
    platforms: ['instagram'],
    thumbnail: '/images/asset_8.jpg',
    createdBy: '2',
    createdAt: '2026-03-06T15:00:00Z',
    scheduledFor: null,
    assignedTo: null,
    platform: null,
  },
  {
    id: '8',
    title: 'March Campaign Opener',
    type: 'slideshow',
    status: 'posted',
    platforms: ['instagram', 'tiktok', 'youtube'],
    thumbnail: '/images/asset_9.jpg',
    createdBy: '3',
    createdAt: '2026-03-05T10:00:00Z',
    scheduledFor: '2026-03-06T09:00:00Z',
    assignedTo: '5',
    platform: 'instagram',
  },
  {
    id: '9',
    title: 'Brand Story Part 1',
    type: 'reel',
    status: 'posted',
    platforms: ['tiktok'],
    thumbnail: '/images/asset_10.jpg',
    createdBy: '2',
    createdAt: '2026-03-04T14:00:00Z',
    scheduledFor: '2026-03-05T16:00:00Z',
    assignedTo: '4',
    platform: 'tiktok',
  },
]

export const teamMembers = [
  {
    id: '1',
    name: 'Dan',
    avatar: '/images/asset_6.jpg',
    handle: '@dan',
    role: 'admin',
    postsCount: 0,
    status: 'active',
  },
  {
    id: '2',
    name: 'Juan Pedro',
    avatar: '/images/asset_7.jpg',
    handle: '@vallejo',
    role: 'creator',
    postsCount: 14,
    status: 'active',
  },
  {
    id: '3',
    name: 'Sara Chen',
    avatar: '/images/asset_8.jpg',
    handle: '@sarachen',
    role: 'creator',
    postsCount: 9,
    status: 'active',
  },
  {
    id: '4',
    name: 'Marcus Bell',
    avatar: '/images/asset_9.jpg',
    handle: '@marcusbell',
    role: 'poster',
    postsCount: 22,
    status: 'active',
  },
  {
    id: '5',
    name: 'Lina Torres',
    avatar: '/images/asset_10.jpg',
    handle: '@linatorres',
    role: 'poster',
    postsCount: 18,
    status: 'inactive',
  },
]

export const menuItems = [
  { icon: 'PhHouse', label: 'Dashboard', path: '/', roles: ['admin', 'creator', 'poster'] },
  { icon: 'PhPencilLine', label: 'Create', path: '/create', roles: ['admin', 'creator'] },
  { icon: 'PhTray', label: 'Queue', path: '/queue', roles: ['admin', 'creator', 'poster'] },
  { icon: 'PhCalendarBlank', label: 'Calendar', path: '/calendar', roles: ['admin', 'poster'] },
  { icon: 'PhUsersThree', label: 'Team', path: '/team', roles: ['admin'] },
  { icon: 'PhGear', label: 'Settings', path: '/settings', roles: ['admin', 'creator', 'poster'] },
]

export const activityFeed = [
  { userId: '2', action: 'Created "Summer Vibes Collection"', time: '2 min ago' },
  { userId: '4', action: 'Posted "March Campaign Opener" to Instagram', time: '15 min ago' },
  { userId: '3', action: 'Created "Product Launch Teaser"', time: '1 hour ago' },
  { userId: '5', action: 'Claimed "Weekly Roundup #12"', time: '3 hours ago' },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data.js
git commit -m "feat: replace NFT mock data with TRXY content management data"
```

---

### Task 5: Update routes and add guards in `main.js`

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: Rewrite `src/main.js`**

Replace all old routes with new TRXY routes. Add `meta.roles` and a `beforeEach` guard. The pinia instance is created first and passed explicitly to `useAuthStore(pinia)` in the guard callback so the store works before `app.mount()`.

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import './style.css'

const pinia = createPinia()

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('./views/dashboard/index.vue'),
    meta: { roles: ['admin', 'creator', 'poster'] },
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('./views/create/index.vue'),
    meta: { roles: ['admin', 'creator'] },
  },
  {
    path: '/queue',
    name: 'queue',
    component: () => import('./views/queue/index.vue'),
    meta: { roles: ['admin', 'creator', 'poster'] },
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('./views/calendar/index.vue'),
    meta: { roles: ['admin', 'poster'] },
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('./views/team/index.vue'),
    meta: { roles: ['admin'] },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./views/settings/index.vue'),
    meta: { roles: ['admin', 'creator', 'poster'] },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore(pinia)
  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return { path: '/' }
  }
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
```

- [ ] **Step 2: Commit**

```bash
git add src/main.js
git commit -m "feat: update routes for TRXY pages with role-based guards"
```

---

### Task 6: Update `App.vue` for role-based menu filtering

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Rewrite `src/App.vue`**

Replace hardcoded user/promo with auth store. Filter menu items by role.

```vue
<script setup>
import { computed } from 'vue'
import SidebarNav from './components/layout/SidebarNav.vue'
import { menuItems } from '@/lib/data'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const filteredMenuItems = computed(() =>
  menuItems.filter(item => item.roles.includes(auth.role))
)

const user = computed(() => ({
  name: auth.currentUser.name,
  role: auth.currentUser.displayRole,
  avatar: auth.currentUser.avatar,
}))

const promo = {
  image: '/images/asset_5.jpg',
  title: 'TRXY Studio',
  verified: true,
  count: '9 Posts Queued',
  rating: '5 Active',
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <SidebarNav :menu-items="filteredMenuItems" :user="user" :promo="promo" />
    <main class="ml-sidebar min-h-screen">
      <router-view />
    </main>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/App.vue
git commit -m "feat: wire App.vue to auth store with role-based menu filtering"
```

---

### Task 7: Update SidebarNav icon imports

**Files:**
- Modify: `src/components/layout/SidebarNav.vue`

- [ ] **Step 1: Update icon imports and iconMap**

Replace old icon imports with the new set. The component structure stays identical — only the imports and `iconMap` change.

In `SidebarNav.vue`, replace the icon imports (lines 3-13) and iconMap (lines 25-35):

Old imports:
```js
import {
  PhCrown,
  PhHouse,
  PhChartBar,
  PhHeart,
  PhUsers,
  PhGear,
  PhBell,
  PhDiamond,
  PhLightning,
  PhSealCheck,
} from '@phosphor-icons/vue'
```

New imports:
```js
import {
  PhCrown,
  PhHouse,
  PhPencilLine,
  PhTray,
  PhCalendarBlank,
  PhUsersThree,
  PhGear,
  PhSealCheck,
} from '@phosphor-icons/vue'
```

Old iconMap:
```js
const iconMap = {
  PhHouse,
  PhChartBar,
  PhHeart,
  PhUsers,
  PhGear,
  PhBell,
  PhDiamond,
  PhLightning,
  PhCrown,
}
```

New iconMap:
```js
const iconMap = {
  PhHouse,
  PhPencilLine,
  PhTray,
  PhCalendarBlank,
  PhUsersThree,
  PhGear,
  PhCrown,
}
```

No other changes to SidebarNav.

- [ ] **Step 2: Verify build**

```bash
cd trxy-frontend && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/SidebarNav.vue
git commit -m "feat: update sidebar icons for TRXY navigation"
```

---

## Chunk 2: Shared Components

### Task 8: Create StatusBadge component

**Files:**
- Create: `src/components/StatusBadge.vue`

- [ ] **Step 1: Create `src/components/StatusBadge.vue`**

Wraps shadcn-vue `Badge` with status-to-style mapping.

```vue
<script setup>
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const props = defineProps({
  status: { type: String, required: true },
  class: { type: [String, Object, Array], default: '' },
})

const statusStyles = {
  draft: 'bg-bg-tertiary text-text-secondary',
  ready: 'bg-accent-pink-light text-accent-pink',
  queued: 'bg-warning/10 text-warning',
  posted: 'bg-success/10 text-success',
  active: 'bg-success/10 text-success',
  inactive: 'bg-bg-tertiary text-text-muted',
}

const statusLabels = {
  draft: 'Draft',
  ready: 'Ready',
  queued: 'Queued',
  posted: 'Posted',
  active: 'Active',
  inactive: 'Inactive',
}
</script>

<template>
  <Badge
    :class="cn(
      'text-[10px] font-medium capitalize border-0 rounded-full px-2.5 py-0.5',
      statusStyles[status] || 'bg-bg-tertiary text-text-secondary',
      props.class
    )"
  >
    {{ statusLabels[status] || status }}
  </Badge>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StatusBadge.vue
git commit -m "feat: add StatusBadge component"
```

---

### Task 9: Create PostCard component

**Files:**
- Create: `src/components/PostCard.vue`

- [ ] **Step 1: Create `src/components/PostCard.vue`**

Follows the same card pattern as the old AssetCard but with post data.

```vue
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PostCard.vue
git commit -m "feat: add PostCard component"
```

---

## Chunk 3: Dashboard Rewrite

### Task 10: Rewrite dashboard view

**Files:**
- Modify: `src/views/dashboard/index.vue`

- [ ] **Step 1: Rewrite `src/views/dashboard/index.vue`**

Same layout structure. Replace NFT stats/assets/balance with TRXY posts/activity.

```vue
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
import { activityFeed, teamMembers } from '@/lib/data'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import PostCard from '@/components/PostCard.vue'
import ThreeRoseViewer from '@/components/ThreeRoseViewer.vue'

const postStore = usePostStore()
const auth = useAuthStore()

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
  return teamMembers.find(m => m.id === userId) || { name: 'Unknown', avatar: '/images/asset_6.jpg' }
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
        class="bg-white border border-border-default rounded-2xl p-5 hover:shadow-card-hover hover:border-accent-pink/30 transition-all duration-200 animate-fade-in-up"
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
        <section class="bg-accent-primary rounded-2xl p-6 text-white animate-fade-in-up" style="animation-delay: 0.3s">
          <p class="text-sm text-white/60 mb-1">Quick Actions</p>
          <p class="text-xl font-bold tracking-tight mb-4">{{ postStore.ready.length }} posts ready</p>
          <p class="text-sm text-white/60 mb-5">{{ postStore.queued.length }} in queue</p>
          <div class="grid grid-cols-2 gap-3">
            <RouterLink
              to="/create"
              class="py-2.5 bg-white text-accent-primary font-medium text-sm rounded-xl hover:bg-white/90 transition-colors text-center"
            >
              New Post
            </RouterLink>
            <RouterLink
              to="/queue"
              class="py-2.5 bg-white/15 text-white font-medium text-sm rounded-xl hover:bg-white/25 transition-colors text-center"
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
```

- [ ] **Step 2: Verify build**

```bash
cd trxy-frontend && npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/views/dashboard/index.vue
git commit -m "feat: rewrite dashboard for TRXY content management"
```

---

## Chunk 4: Create Page

### Task 11: Create the Create view

**Files:**
- Create: `src/views/create/index.vue`

- [ ] **Step 1: Create `src/views/create/index.vue`**

```vue
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
```

- [ ] **Step 2: Commit**

```bash
git add src/views/create/index.vue
git commit -m "feat: add Create view with draft grid and type filter"
```

---

## Chunk 5: Queue Page

### Task 12: Create the Queue view

**Files:**
- Create: `src/views/queue/index.vue`

- [ ] **Step 1: Create `src/views/queue/index.vue`**

Uses the shadcn-vue Table components and TabBar. Posters see a "Claim" button on ready items.

```vue
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
```

- [ ] **Step 2: Commit**

```bash
git add src/views/queue/index.vue
git commit -m "feat: add Queue view with table, tabs, and claim action"
```

---

## Chunk 6: Calendar Page

### Task 13: Create the Calendar view

**Files:**
- Create: `src/views/calendar/index.vue`

- [ ] **Step 1: Create `src/views/calendar/index.vue`**

Simple monthly calendar grid. Posts shown on their scheduled dates.

```vue
<script setup>
import { ref, computed } from 'vue'
import { PhCaretLeft, PhCaretRight, PhCamera, PhMusicNote, PhMonitorPlay } from '@phosphor-icons/vue'
import { usePostStore } from '@/stores/posts'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const postStore = usePostStore()

const currentDate = ref(new Date(2026, 2, 1)) // March 2026

const monthLabel = computed(() =>
  currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

function prevMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}

function nextMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = []
  // Padding for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, posts: [] })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayPosts = postStore.posts.filter(p => {
      if (!p.scheduledFor) return false
      return p.scheduledFor.startsWith(dateStr)
    })
    days.push({ day: d, posts: dayPosts })
  }
  return days
})

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const platformIcons = {
  instagram: PhCamera,
  tiktok: PhMusicNote,
  youtube: PhMonitorPlay,
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Header -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
      <h1 class="text-3xl font-bold tracking-tight text-text-primary mb-1">Calendar</h1>
      <p class="text-sm text-text-secondary">View your scheduled content across platforms.</p>
    </section>

    <!-- Month Navigation -->
    <section class="flex items-center justify-between mb-6 animate-fade-in-up" style="animation-delay: 0.2s">
      <Button variant="ghost" size="sm" @click="prevMonth">
        <PhCaretLeft class="w-4 h-4" />
      </Button>
      <h2 class="text-lg font-semibold text-text-primary">{{ monthLabel }}</h2>
      <Button variant="ghost" size="sm" @click="nextMonth">
        <PhCaretRight class="w-4 h-4" />
      </Button>
    </section>

    <!-- Calendar Grid -->
    <section class="animate-fade-in-up" style="animation-delay: 0.3s">
      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 mb-2">
        <div
          v-for="day in weekdays"
          :key="day"
          class="text-xs font-medium text-text-muted text-center py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7 border-t border-l border-border-default">
        <div
          v-for="(cell, index) in calendarDays"
          :key="index"
          class="min-h-[100px] border-r border-b border-border-default p-2"
          :class="cell.day ? 'bg-white' : 'bg-bg-secondary'"
        >
          <span v-if="cell.day" class="text-xs font-medium text-text-secondary">{{ cell.day }}</span>

          <TooltipProvider v-if="cell.posts.length > 0">
            <div class="mt-1 space-y-1">
              <Tooltip v-for="post in cell.posts" :key="post.id">
                <TooltipTrigger as-child>
                  <div class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent-pink-light cursor-pointer">
                    <component
                      v-for="p in post.platforms.slice(0, 2)"
                      :key="p"
                      :is="platformIcons[p]"
                      class="w-3 h-3 text-accent-pink"
                      weight="fill"
                    />
                    <span class="text-[10px] text-text-primary truncate">{{ post.title }}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p class="font-medium">{{ post.title }}</p>
                  <p class="text-xs text-text-secondary capitalize">{{ post.type }} · {{ post.status }}</p>
                  <p class="text-xs text-text-muted">{{ post.platforms.join(', ') }}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/calendar/index.vue
git commit -m "feat: add Calendar view with monthly grid and post tooltips"
```

---

## Chunk 7: Team + Settings Pages

### Task 14: Create the Team view

**Files:**
- Create: `src/views/team/index.vue`

- [ ] **Step 1: Create `src/views/team/index.vue`**

```vue
<script setup>
import { PhPlus } from '@phosphor-icons/vue'
import { useTeamStore } from '@/stores/team'
import { Badge } from '@/components/ui/badge'
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

const teamStore = useTeamStore()

const roleColors = {
  admin: 'bg-accent-primary text-white',
  creator: 'bg-accent-pink-light text-accent-pink',
  poster: 'bg-bg-tertiary text-text-secondary',
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Header -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
      <div class="flex items-center justify-between mb-1">
        <h1 class="text-3xl font-bold tracking-tight text-text-primary">Team</h1>
        <Button class="gap-2">
          <PhPlus class="w-4 h-4" />
          Invite Member
        </Button>
      </div>
      <p class="text-sm text-text-secondary">{{ teamStore.members.length }} members</p>
    </section>

    <!-- Table -->
    <section class="animate-fade-in-up" style="animation-delay: 0.2s">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Posts</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(member, index) in teamStore.members"
            :key="member.id"
            class="animate-fade-in-up"
            :style="{ animationDelay: `${0.25 + index * 0.05}s` }"
          >
            <TableCell>
              <div class="flex items-center gap-3">
                <img
                  :src="member.avatar"
                  :alt="member.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p class="text-sm font-medium text-text-primary">{{ member.name }}</p>
                  <p class="text-xs text-text-secondary">{{ member.handle }}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                :class="[
                  'text-[10px] font-medium capitalize border-0 rounded-full px-2.5 py-0.5',
                  roleColors[member.role] || 'bg-bg-tertiary text-text-secondary'
                ]"
              >
                {{ member.role }}
              </Badge>
            </TableCell>
            <TableCell class="text-sm text-text-primary">{{ member.postsCount }}</TableCell>
            <TableCell>
              <StatusBadge :status="member.status" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/team/index.vue
git commit -m "feat: add Team view with member table"
```

---

### Task 15: Create the Settings view

**Files:**
- Create: `src/views/settings/index.vue`

- [ ] **Step 1: Create `src/views/settings/index.vue`**

```vue
<script setup>
import { computed } from 'vue'
import { PhCamera, PhMusicNote, PhMonitorPlay } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const auth = useAuthStore()

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: PhCamera, connected: true },
  { id: 'tiktok', label: 'TikTok', icon: PhMusicNote, connected: true },
  { id: 'youtube', label: 'YouTube', icon: PhMonitorPlay, connected: false },
]

const roles = ['admin', 'creator', 'poster']
const activeRole = computed(() => auth.role)
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Header -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
      <h1 class="text-3xl font-bold tracking-tight text-text-primary mb-1">Settings</h1>
      <p class="text-sm text-text-secondary">Manage your profile, platforms, and preferences.</p>
    </section>

    <!-- Profile -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.2s">
      <h2 class="text-lg font-semibold text-text-primary mb-4">Profile</h2>
      <div class="flex items-center gap-4 p-4 bg-white border border-border-default rounded-2xl">
        <img
          :src="auth.currentUser.avatar"
          :alt="auth.currentUser.name"
          class="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p class="text-lg font-semibold text-text-primary">{{ auth.currentUser.name }}</p>
          <p class="text-sm text-text-secondary">{{ auth.currentUser.handle }}</p>
          <p class="text-xs text-text-muted capitalize">{{ auth.currentUser.displayRole }}</p>
        </div>
      </div>
    </section>

    <Separator class="mb-8" />

    <!-- Connected Platforms -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.3s">
      <h2 class="text-lg font-semibold text-text-primary mb-4">Connected Platforms</h2>
      <div class="space-y-3">
        <div
          v-for="platform in platforms"
          :key="platform.id"
          class="flex items-center justify-between p-4 bg-white border border-border-default rounded-2xl"
        >
          <div class="flex items-center gap-3">
            <component :is="platform.icon" class="w-6 h-6 text-text-primary" weight="duotone" />
            <span class="text-sm font-medium text-text-primary">{{ platform.label }}</span>
          </div>
          <span
            class="text-xs font-medium px-2.5 py-1 rounded-full"
            :class="platform.connected ? 'bg-success/10 text-success' : 'bg-bg-tertiary text-text-muted'"
          >
            {{ platform.connected ? 'Connected' : 'Not Connected' }}
          </span>
        </div>
      </div>
    </section>

    <Separator class="mb-8" />

    <!-- Role Switcher (Dev Tool) -->
    <section class="animate-fade-in-up" style="animation-delay: 0.4s">
      <h2 class="text-lg font-semibold text-text-primary mb-1">Role Switcher</h2>
      <p class="text-xs text-text-muted mb-4">Dev tool — switch roles to preview different access levels.</p>
      <div class="flex items-center gap-3">
        <Button
          v-for="r in roles"
          :key="r"
          :variant="activeRole === r ? 'default' : 'outline'"
          size="sm"
          class="capitalize"
          @click="auth.switchRole(r)"
        >
          {{ r }}
        </Button>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/settings/index.vue
git commit -m "feat: add Settings view with profile, platforms, and role switcher"
```

---

## Chunk 8: Cleanup + Final Verification

### Task 16: Delete old files

**Files:**
- Delete: `src/views/placeholder/index.vue`
- Delete: `src/views/user-analytics/index.vue`
- Delete: `src/components/AssetCard.vue`
- Delete: `src/components/BalanceCard.vue`
- Delete: `src/components/TopAssetsTable.vue`

- [ ] **Step 1: Delete old files**

```bash
cd trxy-frontend
rm src/views/placeholder/index.vue
rmdir src/views/placeholder
rm src/views/user-analytics/index.vue
rmdir src/views/user-analytics
rm src/components/AssetCard.vue
rm src/components/BalanceCard.vue
rm src/components/TopAssetsTable.vue
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove old NFT marketplace views and components"
```

---

### Task 17: Final build verification

- [ ] **Step 1: Run build**

```bash
cd trxy-frontend && npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 2: Visual verification**

```bash
cd trxy-frontend && npm run dev
```

Check:
1. Dashboard loads with post stats, recent posts grid, quick actions, team activity
2. Sidebar shows correct nav items
3. Create page shows drafts in a grid with type filter
4. Queue page shows table with status tabs and claim button
5. Calendar shows March 2026 with posts on scheduled dates
6. Team page shows member table (admin only)
7. Settings page shows profile, platforms, role switcher
8. Switching roles in Settings updates sidebar and restricts routes

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address build issues from final verification"
```
