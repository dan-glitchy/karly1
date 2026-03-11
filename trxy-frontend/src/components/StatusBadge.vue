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
