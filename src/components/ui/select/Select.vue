<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({
  modelValue: [String, Number],
  class: String,
  disabled: Boolean,
})
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    :class="cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
    @change="emit('update:modelValue', $event.target.value)"
    v-bind="$attrs"
  >
    <slot />
  </select>
</template>
