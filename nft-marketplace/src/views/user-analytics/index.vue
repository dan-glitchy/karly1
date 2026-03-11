<script setup>
import { ref } from 'vue'
import { PhArrowRight } from '@phosphor-icons/vue'
import { assetCards, creators } from '@/lib/data'
import AssetCard from '@/components/AssetCard.vue'
import BalanceCard from '@/components/BalanceCard.vue'
import TopAssetsTable from '@/components/TopAssetsTable.vue'
import { FilterButton } from '@/components/ui/filter-button'
import { TabBar } from '@/components/ui/tab-bar'

const activeTab = ref('activity')

const filters = [
  { label: 'Sort by', value: 'Price' },
  { label: 'Status', value: 'New' },
  { label: 'Currency', value: 'ETH' },
]

const tabs = [
  { id: 'activity', label: 'Activity', count: null },
  { id: 'created', label: 'Created', count: 23 },
  { id: 'collections', label: 'Collections', count: 4 },
  { id: 'owned', label: 'Owned', count: 117 },
]
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Hero Section -->
    <section class="mb-8">
      <div class="flex items-start justify-between mb-6">
        <div class="animate-fade-in-up" style="animation-delay: 0.1s">
          <h1 class="text-[42px] leading-[1.1] tracking-tight font-extrabold text-text-primary uppercase mb-3">
            MANAGE YOUR ASSETS
          </h1>
          <p class="text-sm text-text-secondary max-w-xl leading-relaxed">
            The world's first and <span class="font-semibold text-text-primary">LARGEST DIGITAL MARKETPLACE</span> for crypto collectibles and digital assets. Buy, sell, and discover exclusive digital items.
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

    <!-- Asset Card Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="(card, index) in assetCards"
        :key="card.id"
        class="animate-fade-in-up"
        :style="{ animationDelay: `${0.2 + index * 0.1}s` }"
      >
        <AssetCard
          :image="card.image"
          :collection="card.collection"
          :token-id="card.tokenId"
          :price="card.price"
          :rating="card.rating"
        />
      </div>
    </section>

    <!-- Activity Section -->
    <section class="animate-fade-in-up" style="animation-delay: 0.4s">
      <TabBar v-model="activeTab" :tabs="tabs" class="mb-8" />

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        <BalanceCard
          :balance="4892.00"
          address="0x12r45...6HJ9"
          action-label="Check Transactions"
        />
        <TopAssetsTable
          :items="creators"
          title="Top Assets"
          subtitle="219 Creators"
        />
      </div>
    </section>
  </div>
</template>
