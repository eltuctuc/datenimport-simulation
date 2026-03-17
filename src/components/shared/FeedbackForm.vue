<script setup>
import { reactive, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import StarRating from './StarRating.vue'

const props = defineProps({
  methodeNr: { type: Number, required: true },
})
const emit = defineEmits(['submit'])

const form = reactive({
  einfachheit: 0,
  praxisnaehe: 0,
  neuartigkeit: 0,
  anmerkungen: '',
})

const isValid = computed(() => form.einfachheit > 0 && form.praxisnaehe > 0 && form.neuartigkeit > 0)

const dimensions = [
  { key: 'einfachheit', label: 'Einfachheit', sub: 'Wie einfach war diese Methode zu bedienen?' },
  { key: 'praxisnaehe', label: 'Praxisnähe', sub: 'Wie gut passt diese Methode zu Ihrem Arbeitsalltag?' },
  { key: 'neuartigkeit', label: 'Neuartigkeit', sub: 'Wie neuartig/zukunftsweisend empfanden Sie diesen Ansatz?' },
]

function submit() {
  if (!isValid.value) return
  emit('submit', { ...form })
}
</script>

<template>
  <div class="space-y-6">
    <div v-for="d in dimensions" :key="d.key" class="space-y-2">
      <div>
        <p class="text-sm font-medium">{{ d.label }}</p>
        <p class="text-xs text-muted-foreground">{{ d.sub }}</p>
      </div>
      <StarRating v-model="form[d.key]" size="lg" />
    </div>

    <div class="space-y-2">
      <p class="text-sm font-medium">Weitere Anmerkungen <span class="text-muted-foreground font-normal">(optional)</span></p>
      <Textarea
        v-model="form.anmerkungen"
        placeholder="Ihre Anmerkungen zu dieser Methode …"
        :rows="3"
      />
    </div>

    <Button class="w-full" :disabled="!isValid" @click="submit">
      Feedback abgeben
    </Button>
    <p v-if="!isValid" class="text-xs text-center text-muted-foreground">Bitte alle drei Dimensionen bewerten</p>
  </div>
</template>
