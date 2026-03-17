<script setup>
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ImportResultPanel from '@/components/shared/ImportResultPanel.vue'
import { useWizard } from '@/composables/useWizard'
import { useImportStore } from '@/stores/useImportStore'
import { ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(3)
const store = useImportStore()

const allRecords = ref([])
onMounted(async () => {
  const mod = await import('@/mock/trainingData3.json')
  allRecords.value = mod.default

  if (store.methode3.importResult) return

  const selected = allRecords.value.filter(r => store.methode3.selectedRecordIds.includes(r.id))
  const notSelected = allRecords.value.length - selected.length

  const errors = selected
    .filter(r => r.status === 'storniert' && !r.grundStornierung)
    .map(r => ({ recordId: r.id, message: `Pflichtfeld 'Stornierungsgrund' fehlt` }))

  const imported = selected.length - errors.length
  const noEnd = selected.filter(r => !r.enddatum).length
  const noSemNr = selected.filter(r => !r.seminarnummer).length
  const noUhrzeit = selected.filter(r => !r.beginnUhrzeit).length

  const result = {
    imported,
    skipped: notSelected,
    warnings: [
      noEnd > 0 ? { message: 'Enddatum fehlt oder nicht erkannt (OCR)', count: noEnd } : null,
      noSemNr > 0 ? { message: 'Seminarnummer fehlt oder nicht erkannt', count: noSemNr } : null,
      noUhrzeit > 0 ? { message: 'Uhrzeiten nicht erkannt', count: noUhrzeit } : null,
    ].filter(Boolean),
    errors,
  }

  wizard.setResult(result)
  wizard.addRecords(selected.slice(0, imported))
})
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 6: Importergebnis</CardTitle>
        <CardDescription>Ergebnis des Imports der per KI erkannten Daten.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <ImportResultPanel v-if="store.methode3.importResult" :result="store.methode3.importResult" />
        <div class="flex justify-end pt-2">
          <Button @click="emit('next')">
            Weiter zum Feedback
            <ArrowRight class="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
