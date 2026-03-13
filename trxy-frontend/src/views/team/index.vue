<script setup>
import { PhArrowRight, PhPlus } from '@phosphor-icons/vue'
import { useTeamStore } from '@/stores/team'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/StatusBadge.vue'
import { FilterButton } from '@/components/ui/filter-button'

const teamStore = useTeamStore()

const filters = [
  { label: 'Sort by', value: 'Name' },
  { label: 'Role', value: 'All' },
  { label: 'Status', value: 'Active' },
]

const roleColors = {
  admin: 'bg-accent-primary text-bg-primary',
  creator: 'bg-accent-pink-light text-accent-pink',
  poster: 'bg-bg-tertiary text-text-secondary',
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 py-8">
    <!-- Hero Section -->
    <section class="mb-8">
      <div class="flex items-start justify-between mb-6">
        <div class="animate-fade-in-up" style="animation-delay: 0.1s">
          <h1 class="text-[42px] leading-[1.1] tracking-tight font-extrabold text-text-primary uppercase mb-3">
            YOUR TEAM
          </h1>
          <p class="text-sm text-text-secondary max-w-xl leading-relaxed">
            Manage your <span class="font-semibold text-text-primary">CREATORS AND POSTERS</span>. Invite new members, assign roles, and track contribution across all platforms.
          </p>
        </div>

        <div class="animate-fade-in-up" style="animation-delay: 0.2s">
          <Button class="gap-2">
            <PhPlus class="w-4 h-4" />
            Invite Member
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

    <!-- Team Table -->
    <section class="animate-fade-in-up" style="animation-delay: 0.4s">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-bold tracking-tight text-text-primary">Members</h2>
          <span class="text-sm text-text-secondary">{{ teamStore.members.length }} Total</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left">
              <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Member</th>
              <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Role</th>
              <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Posts</th>
              <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
              <th class="pb-4 text-xs font-medium text-text-muted uppercase tracking-wider">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(member, index) in teamStore.members"
              :key="member.id"
              class="group hover:bg-accent-pink-light transition-colors duration-150 cursor-pointer animate-fade-in-up"
              :style="{ animationDelay: `${0.5 + index * 0.05}s` }"
            >
              <td class="py-4">
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
              </td>
              <td class="py-4">
                <Badge
                  :class="[
                    'text-[10px] font-medium capitalize border-0 rounded-full px-2.5 py-0.5',
                    roleColors[member.role] || 'bg-bg-tertiary text-text-secondary'
                  ]"
                >
                  {{ member.role }}
                </Badge>
              </td>
              <td class="py-4">
                <span class="text-sm text-text-primary">{{ member.postsCount }}</span>
              </td>
              <td class="py-4">
                <StatusBadge :status="member.status" />
              </td>
              <td class="py-4">
                <span class="text-sm text-text-secondary">{{ member.handle }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
