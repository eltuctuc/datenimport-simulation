<script setup>
import { ref, onMounted } from 'vue'
import { Progress } from '@/components/ui/progress'

const props = defineProps({
  label: { type: String, default: 'Wird verarbeitet …' },
  subLabel: { type: String, default: null },
  durationMs: { type: Number, default: 1500 },
  steps: { type: Array, default: null }, // Optional: array of step strings
})
const emit = defineEmits(['done'])

const progress = ref(0)
const currentStepIdx = ref(0)
const interval = ref(null)

onMounted(() => {
  const start = Date.now()
  interval.value = setInterval(() => {
    const elapsed = Date.now() - start
    progress.value = Math.min(100, (elapsed / props.durationMs) * 100)

    if (props.steps) {
      currentStepIdx.value = Math.min(
        props.steps.length - 1,
        Math.floor((elapsed / props.durationMs) * props.steps.length)
      )
    }

    if (elapsed >= props.durationMs) {
      progress.value = 100
      clearInterval(interval.value)
      setTimeout(() => emit('done'), 200)
    }
  }, 50)
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <div class="relative h-16 w-16">
      <svg class="animate-spin h-16 w-16 text-primary" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" stroke-opacity="0.15" />
        <circle
          cx="32" cy="32" r="28"
          stroke="currentColor" stroke-width="4"
          stroke-linecap="round"
          stroke-dasharray="88 88"
          :stroke-dashoffset="88 - (88 * progress / 100)"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-primary">
        {{ Math.round(progress) }}%
      </span>
    </div>

    <div class="text-center">
      <p class="font-medium">{{ label }}</p>
      <p v-if="steps" class="text-sm text-muted-foreground mt-1 animate-pulse">
        {{ steps[currentStepIdx] }}
      </p>
      <p v-else-if="subLabel" class="text-sm text-muted-foreground mt-1">{{ subLabel }}</p>
    </div>

    <Progress :model-value="progress" class="w-64 h-2" />
  </div>
</template>
