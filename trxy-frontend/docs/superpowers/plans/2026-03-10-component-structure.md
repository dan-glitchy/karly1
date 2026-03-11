# Component Structure Refactor — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the monolithic DashboardView.vue (247 lines) into 10 focused components following the flat page folder convention.

**Architecture:** Each view becomes a folder with `index.vue` as the layout orchestrator. Page-specific components live flat alongside it. Shared components (`FilterSelect`, `EthIcon`) live in `src/components/`. No functionality or visual changes — pure structural refactor.

**Tech Stack:** Vue 3 (Composition API, `<script setup>`), Tailwind CSS v4, Pinia, Lucide Vue Next

**Spec:** `docs/superpowers/specs/2026-03-10-component-structure-design.md`

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/EthIcon.vue` | Reusable ETH diamond SVG |
| Create | `src/components/FilterSelect.vue` | Reusable filter pill |
| Create | `src/views/dashboard/index.vue` | Layout orchestrator |
| Create | `src/views/dashboard/HeroBanner.vue` | Hero section with watermark + filters |
| Create | `src/views/dashboard/NftCard.vue` | Single NFT card (presentational) |
| Create | `src/views/dashboard/NftCardGrid.vue` | 4-col grid wrapping NftCards |
| Create | `src/views/dashboard/CollectionCard.vue` | Gradient header + collection stats |
| Create | `src/views/dashboard/BalanceCard.vue` | White balance card |
| Create | `src/views/dashboard/ProfileSummary.vue` | Creator info + revenue |
| Create | `src/views/dashboard/TopCreatorsTable.vue` | Leaderboard table |
| Modify | `src/main.js:9` | Update dashboard route import path |
| Modify | `src/views/UserAnalyticsView.vue` | Move to `src/views/user-analytics/index.vue` |
| Delete | `src/views/DashboardView.vue` | Replaced by `dashboard/index.vue` |

---

## Task 1: Create Global Shared Components

**Files:**
- Create: `src/components/EthIcon.vue`
- Create: `src/components/FilterSelect.vue`

- [ ] **Step 1: Create EthIcon.vue**

```vue
<script setup>
defineProps({
  size: { type: Number, default: 12 },
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 320 512" fill="currentColor">
    <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
  </svg>
</template>
```

- [ ] **Step 2: Create FilterSelect.vue**

```vue
<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, required: true },
  options: { type: Array, required: true },
  variant: { type: String, default: 'dark' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex items-center h-8 rounded-full border"
    :class="variant === 'dark'
      ? 'bg-zinc-800 border-zinc-700/50'
      : 'bg-zinc-200 border-transparent'"
  >
    <span class="text-[11px] pl-3.5 pr-1"
      :class="variant === 'dark' ? 'text-zinc-500' : 'text-zinc-500'"
    >{{ label }}</span>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target).value)"
      class="filter-select h-full text-[11px] font-semibold pl-2.5 rounded-full appearance-none cursor-pointer border-0 focus:outline-none"
      :class="variant === 'dark'
        ? 'bg-zinc-700 text-zinc-200'
        : 'bg-zinc-300 text-zinc-900'"
    >
      <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
    </select>
  </div>
</template>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds (components not imported yet, but no syntax errors)

---

## Task 2: Create Dashboard Page Components (Part 1 — Hero + NFT Cards)

**Files:**
- Create: `src/views/dashboard/HeroBanner.vue`
- Create: `src/views/dashboard/NftCard.vue`
- Create: `src/views/dashboard/NftCardGrid.vue`

- [ ] **Step 1: Create HeroBanner.vue**

Extract lines 27-63 from DashboardView.vue. Uses `FilterSelect` and accesses `nftStore` directly for v-model bindings.

```vue
<script setup>
import { useNftStore } from '../../stores/nftStore'
import FilterSelect from '../../components/FilterSelect.vue'

const nftStore = useNftStore()
</script>

<template>
  <div class="bg-black rounded-2xl p-7 pb-32 relative overflow-hidden">
    <!-- Watermark -->
    <div class="absolute top-2 right-0 pointer-events-none select-none whitespace-nowrap leading-none">
      <p class="text-[64px] font-black text-white/[0.07] tracking-tight">EXPLORE ALL P</p>
      <p class="text-[64px] font-black text-white/[0.05] tracking-tight mt-1">EXPLORE A</p>
      <p class="text-[64px] font-black text-white/[0.03] tracking-tight mt-1">EXPLO</p>
    </div>
    <div class="relative z-10">
      <h1 class="text-[26px] font-black text-white tracking-tight">MANAGE YOUR NFTs</h1>
      <p class="text-zinc-500 text-[13px] leading-relaxed mt-2.5 max-w-xl">
        The world's first and
        <span class="text-brand-light font-bold underline decoration-brand decoration-2 underline-offset-2">LARGEST DIGITAL MARKETPLACE</span>
        for crypto collectibles and non-fungible tokens (NFTs). Buy, sell, and discover exclusive digital items.
      </p>
      <!-- Filters -->
      <div class="flex items-center gap-2.5 mt-5">
        <FilterSelect label="Sort by" v-model="nftStore.sortBy" :options="['Price', 'Rating', 'Name']" />
        <FilterSelect label="Status" v-model="nftStore.status" :options="['New', 'Hot', 'Trending']" />
        <FilterSelect label="Currency" v-model="nftStore.currency" :options="['ETH', 'BTC', 'SOL']" />
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create NftCard.vue**

Single card, fully presentational. Receives one `nft` object as prop.

```vue
<script setup>
import { Gem, Flame, Leaf, Cpu } from 'lucide-vue-next'
import EthIcon from '../../components/EthIcon.vue'

const props = defineProps({
  nft: { type: Object, required: true },
})

const iconComponents = { Gem, Flame, Leaf, Cpu }

const nftColors = {
  purple: { accent: '#a855f7', bg: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 50%, #c084fc 100%)' },
  orange: { accent: '#f97316', bg: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)' },
  green:  { accent: '#22c55e', bg: 'linear-gradient(135deg, #bbf7d0 0%, #86efac 50%, #4ade80 100%)' },
  blue:   { accent: '#3b82f6', bg: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #60a5fa 100%)' },
}

const emojis = { purple: '👾', orange: '🎭', green: '🐸', blue: '🤖' }
</script>

<template>
  <div class="bg-zinc-800 rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-1 transition-transform duration-200">
    <div class="p-2.5 pb-0">
      <div
        class="aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center"
        :style="{ background: nftColors[nft.shapes].bg }"
      >
        <div class="text-5xl group-hover:scale-110 transition-transform duration-300 select-none" style="filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15))">
          {{ emojis[nft.shapes] }}
        </div>
      </div>
    </div>
    <div class="px-3 pt-2 pb-2.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 min-w-0">
          <component :is="iconComponents[nft.icon]" :size="16" :color="nftColors[nft.shapes].accent" :stroke-width="2" class="shrink-0" />
          <span class="text-[12px] font-medium text-white truncate">{{ nft.name }}</span>
        </div>
        <svg v-if="nft.verified" class="w-4 h-4 text-brand shrink-0 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
      </div>
      <div class="flex items-center justify-between mt-1.5 text-[10.5px] text-zinc-400">
        <div class="flex items-center gap-1">
          <EthIcon :size="10" />
          <span class="text-white font-semibold">{{ nft.price }}</span>
          <span>Ethereum</span>
        </div>
        <div>
          <span class="text-white font-semibold">{{ nft.rating }}/{{ nft.ratingMax }}</span>
          <span class="ml-0.5">Rating</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Create NftCardGrid.vue**

Grid wrapper that iterates NftCard components.

```vue
<script setup>
import NftCard from './NftCard.vue'

defineProps({
  nfts: { type: Array, required: true },
})
</script>

<template>
  <div class="grid grid-cols-4 gap-3.5 -mt-24 relative z-10 px-8">
    <NftCard v-for="nft in nfts" :key="nft.id" :nft="nft" />
  </div>
</template>
```

---

## Task 3: Create Dashboard Page Components (Part 2 — Bottom Section)

**Files:**
- Create: `src/views/dashboard/CollectionCard.vue`
- Create: `src/views/dashboard/BalanceCard.vue`
- Create: `src/views/dashboard/ProfileSummary.vue`
- Create: `src/views/dashboard/TopCreatorsTable.vue`

- [ ] **Step 1: Create CollectionCard.vue**

Extract lines 113-134. Includes gradient header, collection info, tabs.

```vue
<script setup>
import { useThemeStore } from '../../stores/themeStore'
import { useUserStore } from '../../stores/userStore'
import { storeToRefs } from 'pinia'
import { Hexagon } from 'lucide-vue-next'

const theme = useThemeStore()
const { profile, activeTab, tabs } = storeToRefs(useUserStore())
</script>

<template>
  <div>
    <!-- Collection Card -->
    <div class="rounded-2xl overflow-hidden transition-colors duration-300" :class="theme.isDark ? 'bg-zinc-800' : 'bg-white shadow-sm'">
      <div class="h-44 relative" style="background: linear-gradient(135deg, #7c3aed, #8b5cf6, #a78bfa, #c084fc, #818cf8);">
        <div class="absolute inset-0 opacity-20">
          <div class="absolute w-16 h-16 bg-white rounded-full top-6 left-6"></div>
          <div class="absolute w-24 h-24 bg-white rounded-full top-10 right-4"></div>
          <div class="absolute w-12 h-12 bg-white rounded-2xl bottom-4 left-1/3 rotate-12"></div>
        </div>
      </div>
      <div class="px-3 py-3">
        <div class="flex items-center gap-2">
          <Hexagon :size="18" class="text-brand shrink-0" :stroke-width="2" />
          <span class="text-[12px] font-semibold" :class="theme.isDark ? 'text-white' : 'text-zinc-900'">{{ profile.collectionName }}</span>
          <svg class="w-3.5 h-3.5 text-brand shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="flex items-center gap-4 mt-2 text-[11px]" :class="theme.isDark ? 'text-zinc-400' : 'text-zinc-500'">
          <span><span :class="theme.isDark ? 'text-white' : 'text-zinc-900'" class="font-semibold">{{ profile.pieces }}</span> Pieces</span>
          <span><span :class="theme.isDark ? 'text-white' : 'text-zinc-900'" class="font-semibold">{{ profile.rating }}/{{ profile.ratingMax }}</span> Rating</span>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center overflow-x-auto transition-colors duration-300 mt-4" :class="theme.isDark ? 'border-b border-zinc-700/60' : 'border-b border-zinc-200'">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="activeTab = tab.name"
        class="relative px-1.5 py-2 text-[11.5px] font-medium transition-colors whitespace-nowrap first:pl-0"
        :class="activeTab === tab.name
          ? (theme.isDark ? 'text-white' : 'text-zinc-900')
          : (theme.isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')"
      >
        {{ tab.name }}<span :class="theme.isDark ? 'text-zinc-500' : 'text-zinc-400'" v-if="tab.count !== null">({{ tab.count }})</span>
        <div v-if="activeTab === tab.name" class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand"></div>
      </button>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create BalanceCard.vue**

Extract lines 152-163. White card with volume, address, CTA.

```vue
<script setup>
import { useThemeStore } from '../../stores/themeStore'
import EthIcon from '../../components/EthIcon.vue'

const theme = useThemeStore()

defineProps({
  balance: { type: Object, required: true },
})
</script>

<template>
  <div class="rounded-2xl p-4 transition-colors duration-300" :class="theme.isDark ? 'bg-white' : 'bg-white shadow-md border border-zinc-200'">
    <div class="text-[11px] text-neutral-500">Your Balance <span class="text-neutral-400">(Volume)</span></div>
    <div class="flex items-center gap-1.5 mt-2.5">
      <EthIcon :size="16" class="text-neutral-600" />
      <span class="text-[32px] font-bold text-black tracking-tight leading-none">{{ balance.volume.toFixed(2) }}</span>
    </div>
    <div class="text-[10.5px] text-neutral-400 mt-2">Your Address: {{ balance.address }}</div>
    <button class="w-full mt-3.5 bg-brand text-white py-2.5 rounded-full text-[12px] font-semibold hover:bg-brand-dark transition-colors cursor-pointer">
      Check Transactions
    </button>
  </div>
</template>
```

- [ ] **Step 3: Create ProfileSummary.vue**

Extract lines 165-181. Creator avatar + name + role + revenue.

```vue
<script setup>
import { useThemeStore } from '../../stores/themeStore'
import EthIcon from '../../components/EthIcon.vue'

const theme = useThemeStore()

defineProps({
  profile: { type: Object, required: true },
  balance: { type: Object, required: true },
})
</script>

<template>
  <div class="space-y-4">
    <!-- Creator -->
    <div class="flex items-center gap-2.5">
      <img :src="profile.avatar" :alt="profile.name" class="w-10 h-10 rounded-full" />
      <div>
        <div class="text-[13px] font-semibold" :class="theme.isDark ? 'text-white' : 'text-zinc-900'">{{ profile.name }}</div>
        <div class="text-[11px]" :class="theme.isDark ? 'text-zinc-500' : 'text-zinc-400'">{{ profile.role }}</div>
      </div>
    </div>

    <!-- Revenue -->
    <div>
      <div class="text-[12px]" :class="theme.isDark ? 'text-zinc-400' : 'text-zinc-500'">Revenue</div>
      <div class="flex items-center gap-1.5 mt-1">
        <EthIcon :size="14" :class="theme.isDark ? 'text-zinc-400' : 'text-zinc-500'" />
        <span class="text-[24px] font-bold tracking-tight" :class="theme.isDark ? 'text-white' : 'text-zinc-900'">{{ balance.revenue.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Create TopCreatorsTable.vue**

Extract lines 184-244. Table with header and currency filter.

```vue
<script setup>
import { useThemeStore } from '../../stores/themeStore'
import FilterSelect from '../../components/FilterSelect.vue'
import EthIcon from '../../components/EthIcon.vue'
import { ref } from 'vue'

const theme = useThemeStore()
const tableCurrency = ref('USD')

defineProps({
  creators: { type: Array, required: true },
})
</script>

<template>
  <div class="flex-1 min-w-0">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-baseline gap-2">
        <h3 class="text-[17px] font-bold" :class="theme.isDark ? 'text-white' : 'text-zinc-900'">Top NFTs</h3>
        <span class="text-[12px]" :class="theme.isDark ? 'text-zinc-500' : 'text-zinc-400'">219 Creators</span>
      </div>
      <FilterSelect
        label="Currency"
        v-model="tableCurrency"
        :options="['USD', 'ETH', 'BTC']"
        :variant="theme.isDark ? 'dark' : 'light'"
      />
    </div>
    <!-- Table -->
    <table class="w-full">
      <thead>
        <tr class="text-[11px]" :class="theme.isDark ? 'text-zinc-500' : 'text-zinc-400'">
          <th class="text-left font-medium pb-2.5">Collections</th>
          <th class="text-left font-medium pb-2.5">Volume</th>
          <th class="text-left font-medium pb-2.5">Flow Price</th>
          <th class="text-left font-medium pb-2.5">Status</th>
          <th class="text-left font-medium pb-2.5">Owners</th>
          <th class="text-left font-medium pb-2.5">Items</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="c in creators"
          :key="c.handle"
          class="border-t transition-colors"
          :class="theme.isDark ? 'border-zinc-800 hover:bg-zinc-800/40' : 'border-zinc-200 hover:bg-zinc-50'"
        >
          <td class="py-3">
            <div class="flex items-center gap-2.5">
              <img :src="c.avatar" :alt="c.name" class="w-8 h-8 rounded-full" />
              <div>
                <div class="text-[12.5px] font-semibold" :class="theme.isDark ? 'text-white' : 'text-zinc-900'">{{ c.name }}</div>
                <div class="text-[10.5px]" :class="theme.isDark ? 'text-zinc-500' : 'text-zinc-400'">{{ c.handle }}</div>
              </div>
            </div>
          </td>
          <td class="py-3 text-[12px]">
            <div class="flex items-center gap-1">
              <EthIcon :size="8" :class="theme.isDark ? 'text-zinc-400' : 'text-zinc-500'" />
              <span :class="theme.isDark ? 'text-white' : 'text-zinc-900'">{{ c.volume.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
            </div>
          </td>
          <td class="py-3 text-[12px]" :class="theme.isDark ? 'text-white' : 'text-zinc-900'">{{ c.flowPrice }}</td>
          <td class="py-3 text-[12px] font-medium">
            <span :class="c.status >= 0 ? 'text-emerald-400' : 'text-red-400'">
              {{ c.status >= 0 ? '+' : '' }}{{ c.status.toFixed(2) }}%
            </span>
          </td>
          <td class="py-3 text-[12px]" :class="theme.isDark ? 'text-white' : 'text-zinc-900'">{{ c.owners }}</td>
          <td class="py-3 text-[12px]" :class="theme.isDark ? 'text-white' : 'text-zinc-900'">{{ c.items }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

---

## Task 4: Create Dashboard Index + Update Router + Move UserAnalytics

**Files:**
- Create: `src/views/dashboard/index.vue`
- Create: `src/views/user-analytics/index.vue`
- Modify: `src/main.js:9-10`
- Delete: `src/views/DashboardView.vue`
- Delete: `src/views/UserAnalyticsView.vue`

- [ ] **Step 1: Create dashboard/index.vue**

Layout orchestrator that imports all dashboard components and passes store data as props.

```vue
<script setup>
import { useNftStore } from '../../stores/nftStore'
import { useUserStore } from '../../stores/userStore'
import { useThemeStore } from '../../stores/themeStore'
import { storeToRefs } from 'pinia'

import HeroBanner from './HeroBanner.vue'
import NftCardGrid from './NftCardGrid.vue'
import CollectionCard from './CollectionCard.vue'
import BalanceCard from './BalanceCard.vue'
import ProfileSummary from './ProfileSummary.vue'
import TopCreatorsTable from './TopCreatorsTable.vue'

const nftStore = useNftStore()
const theme = useThemeStore()
const { profile, balance } = storeToRefs(useUserStore())
</script>

<template>
  <div class="p-5 min-h-screen transition-colors duration-300" :class="theme.isDark ? 'bg-zinc-900' : 'bg-zinc-100'">
    <HeroBanner />
    <NftCardGrid :nfts="nftStore.sortedNfts" />

    <!-- Bottom Section -->
    <div class="flex gap-6 mt-8 items-start transition-colors duration-300">
      <!-- Left Column -->
      <div class="w-[260px] shrink-0 space-y-4">
        <CollectionCard />
        <BalanceCard :balance="balance" />
        <ProfileSummary :profile="profile" :balance="balance" />
      </div>

      <!-- Right Column -->
      <TopCreatorsTable :creators="nftStore.topCreators" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Move UserAnalyticsView to user-analytics/index.vue**

Copy `src/views/UserAnalyticsView.vue` contents to `src/views/user-analytics/index.vue`.

- [ ] **Step 3: Update router in main.js**

Change line 9 from:
```js
{ path: '/dashboard', component: () => import('./views/DashboardView.vue') },
```
To:
```js
{ path: '/dashboard', component: () => import('./views/dashboard/index.vue') },
```

Change line 10 from:
```js
{ path: '/user-analytics', component: () => import('./views/UserAnalyticsView.vue') },
```
To:
```js
{ path: '/user-analytics', component: () => import('./views/user-analytics/index.vue') },
```

- [ ] **Step 4: Delete old monolithic files**

Delete `src/views/DashboardView.vue` and `src/views/UserAnalyticsView.vue`.

- [ ] **Step 5: Build and verify**

Run: `npm run build`
Expected: Build succeeds with no errors. Output should show `dashboard/index` chunk instead of `DashboardView`.

- [ ] **Step 6: Visual verification**

Run: `npm run dev`
Open `http://localhost:5173/dashboard` in browser. Verify:
- Hero banner with watermark and filters renders identically
- NFT cards overlap the hero at half-height
- Bottom section has left column (collection, balance, profile) and right column (table)
- Theme toggle works (bottom section responds, hero/cards stay dark)
- Filter dropdowns work (sort by, status, currency)
