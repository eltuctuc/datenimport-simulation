<script setup>
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  steps: { type: Array, required: true },
  icon: { type: Object, required: true },
  completed: { type: Boolean, default: false },
  inProgress: { type: Boolean, default: false },
  currentStep: { type: Number, default: 1 },
  totalSteps: { type: Number, default: 6 },
})
const emit = defineEmits(['start'])

const statusBadge = computed(() => {
  if (props.completed) return { label: 'Abgeschlossen', variant: 'success' }
  if (props.inProgress) return { label: `Schritt ${props.currentStep} / ${props.totalSteps}`, variant: 'secondary' }
  return { label: 'Ausstehend', variant: 'outline' }
})
</script>

<template>
  <Card
    class="flex flex-col cursor-pointer group hover:shadow-md transition-all duration-200 hover:border-primary/40"
    @click="emit('start')"
  >
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between gap-2">
        <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <component :is="icon" class="h-5 w-5 text-primary" />
        </div>
        <Badge :variant="statusBadge.variant">
          <CheckCircle2 v-if="completed" class="h-3 w-3 mr-1" />
          <Clock v-else-if="inProgress" class="h-3 w-3 mr-1" />
          {{ statusBadge.label }}
        </Badge>
      </div>
      <div class="mt-3">
        <p class="text-xs text-muted-foreground font-medium uppercase tracking-wide">Methode {{ number }}</p>
        <CardTitle class="mt-0.5 text-base">{{ title }}</CardTitle>
      </div>
    </CardHeader>

    <CardContent class="flex-1 pb-3">
      <CardDescription class="text-sm">{{ description }}</CardDescription>
      <ul class="mt-3 space-y-1">
        <li v-for="(step, i) in steps" :key="i" class="flex items-center gap-2 text-xs text-muted-foreground">
          <span class="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">{{ i + 1 }}</span>
          {{ step }}
        </li>
      </ul>
    </CardContent>

    <CardFooter>
      <Button class="w-full" :variant="completed ? 'outline' : 'default'" size="sm">
        {{ completed ? 'Erneut starten' : inProgress ? 'Fortfahren' : 'Starten' }}
        <ArrowRight class="h-3.5 w-3.5 ml-1" />
      </Button>
    </CardFooter>
  </Card>
</template>
