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
