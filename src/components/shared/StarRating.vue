<script setup>
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readonly: { type: Boolean, default: false },
  max: { type: Number, default: 5 },
  size: { type: String, default: 'md' },
})
const emit = defineEmits(['update:modelValue'])

const hovered = ref(0)

const sizeClass = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}
</script>

<template>
  <div class="flex items-center gap-1" :class="readonly ? '' : 'cursor-pointer'">
    <button
      v-for="i in max"
      :key="i"
      type="button"
      :disabled="readonly"
      class="focus:outline-none transition-transform"
      :class="readonly ? '' : 'hover:scale-110'"
      @mouseover="!readonly && (hovered = i)"
      @mouseleave="!readonly && (hovered = 0)"
      @click="!readonly && emit('update:modelValue', i)"
    >
      <Star
        :class="[
          sizeClass[size] || sizeClass.md,
          'transition-colors',
          (hovered || modelValue) >= i
            ? 'fill-amber-400 text-amber-400'
            : 'text-muted-foreground/40',
        ]"
      />
    </button>
  </div>
</template>
