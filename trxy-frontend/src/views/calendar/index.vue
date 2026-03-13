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
          :class="cell.day ? 'bg-bg-primary' : 'bg-bg-secondary'"
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
