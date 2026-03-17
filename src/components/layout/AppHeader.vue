<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const router = useRouter()
const route = useRoute()

const isHome = computed(() => route.name === 'home')
const isErgebnis = computed(() => route.name === 'ergebnis')

const title = computed(() => {
  if (isHome.value) return 'Datenimport-Simulation'
  if (isErgebnis.value) return 'Auswertung & Ergebnis'
  const m = route.path.match(/methode\/(\d)/)
  if (m) return `Methode ${m[1]}`
  return 'Datenimport-Simulation'
})
</script>

<template>
  <header class="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
      <Button
        v-if="!isHome"
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        @click="router.push('/')"
      >
        <ArrowLeft class="h-4 w-4" />
      </Button>

      <div class="flex items-center gap-2">
        <div class="h-6 w-6 rounded bg-primary flex items-center justify-center">
          <span class="text-white text-xs font-bold">DI</span>
        </div>
        <span class="font-semibold text-sm">{{ title }}</span>
      </div>

      <div class="ml-auto">
        <Button
          v-if="!isErgebnis"
          variant="outline"
          size="sm"
          @click="router.push('/ergebnis')"
        >
          Auswertung
        </Button>
      </div>
    </div>
  </header>
</template>
