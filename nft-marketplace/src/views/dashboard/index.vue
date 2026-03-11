<script setup>
import {
  PhArrowRight,
  PhTrendUp,
  PhTrendDown,
  PhShoppingCart,
  PhCurrencyDollar,
  PhUsers,
  PhCopy,
} from '@phosphor-icons/vue'
import { assetCards, creators } from '@/lib/data'
import AssetCard from '@/components/AssetCard.vue'
import ThreeRoseViewer from '@/components/ThreeRoseViewer.vue'

const stats = [
  { label: 'Total Volume', value: '31,983.48', change: '+12.5%', trend: 'up', icon: 'PhCurrencyDollar' },
  { label: 'Total Sales', value: '1,293', change: '+8.2%', trend: 'up', icon: 'PhShoppingCart' },
  { label: 'Active Users', value: '8,421', change: '-2.4%', trend: 'down', icon: 'PhUsers' },
]

const iconMap = { PhCurrencyDollar, PhShoppingCart, PhUsers }

const recentActivity = [
  { user: creators[0], action: 'Listed a new collection', time: '2 min ago' },
  { user: creators[1], action: 'Purchased WGMinterfaces #2931', time: '15 min ago' },
  { user: creators[2], action: 'Updated collection floor price', time: '1 hour ago' },
  { user: creators[3], action: 'Transferred 3 items', time: '3 hours ago' },
]
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Welcome Header -->
    <section class="mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
      <h1 class="text-3xl font-bold tracking-tight text-text-primary mb-1">
        Welcome back, Dan
      </h1>
      <p class="text-sm text-text-secondary">
        Here's what's happening with your marketplace today.
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
      <!-- Trending Assets -->
      <section class="animate-fade-in-up" style="animation-delay: 0.3s">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-text-primary">Trending Assets</h2>
          <RouterLink
            to="/user-analytics"
            class="group flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            View all
            <PhArrowRight class="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div
            v-for="(card, index) in assetCards.slice(0, 4)"
            :key="card.id"
            class="animate-fade-in-up"
            :style="{ animationDelay: `${0.35 + index * 0.07}s` }"
          >
            <AssetCard
              :image="card.image"
              :collection="card.collection"
              :token-id="card.tokenId"
              :price="card.price"
              :rating="card.rating"
            />
          </div>
        </div>
      </section>

      <!-- Right Column -->
      <div class="space-y-8">
        <!-- Quick Balance -->
        <section class="bg-accent-primary rounded-2xl p-6 text-white animate-fade-in-up" style="animation-delay: 0.3s">
          <p class="text-sm text-white/60 mb-1">Your Balance</p>
          <p class="text-3xl font-bold tracking-tight mb-4">4,892.00</p>
          <div class="flex items-center gap-2 text-sm text-white/60 mb-5">
            <span>0x12r45...6HJ9</span>
            <button class="text-white/80 hover:text-white transition-colors">
              <PhCopy class="w-3.5 h-3.5" />
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button class="py-2.5 bg-white text-accent-primary font-medium text-sm rounded-xl hover:bg-white/90 transition-colors">
              Send
            </button>
            <button class="py-2.5 bg-white/15 text-white font-medium text-sm rounded-xl hover:bg-white/25 transition-colors">
              Receive
            </button>
          </div>
        </section>

        <!-- Recent Activity -->
        <section class="animate-fade-in-up" style="animation-delay: 0.4s">
          <h2 class="text-xl font-bold text-text-primary mb-5">Recent Activity</h2>
          <ul class="space-y-4">
            <li
              v-for="(activity, index) in recentActivity"
              :key="index"
              class="flex items-center gap-3 animate-fade-in-up"
              :style="{ animationDelay: `${0.45 + index * 0.05}s` }"
            >
              <img
                :src="activity.user.avatar"
                :alt="activity.user.name"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-text-primary">
                  <span class="font-medium">{{ activity.user.name }}</span>
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
