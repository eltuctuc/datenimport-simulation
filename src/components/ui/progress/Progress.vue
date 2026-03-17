<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  class: String,
})
</script>

<template>
  <div
    :class="cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', props.class)"
    role="progressbar"
    :aria-valuenow="modelValue"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full bg-primary transition-all duration-500 ease-in-out"
      :style="{ width: `${Math.min(100, Math.max(0, modelValue))}%` }"
    />
  </div>
</template>
