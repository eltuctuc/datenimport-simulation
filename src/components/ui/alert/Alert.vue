<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: { type: String, default: 'default' },
  class: String,
})

const variants = {
  default: 'bg-background text-foreground',
  destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600',
  success: 'border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600',
}

const classes = computed(() =>
  cn(
    'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
    variants[props.variant] || variants.default,
    props.class,
  ),
)
</script>

<template>
  <div :class="classes" role="alert"><slot /></div>
</template>
