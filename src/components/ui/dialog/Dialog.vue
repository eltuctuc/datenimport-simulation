<script setup>
import { cn } from '@/lib/utils'

defineProps({
  open: Boolean,
})
defineEmits(['update:open'])
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('update:open', false)"
        />
        <div class="relative z-50 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg animate-slide-in">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active, .dialog-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-enter-from, .dialog-leave-to {
  opacity: 0;
}
</style>
