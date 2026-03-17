<script setup>
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
