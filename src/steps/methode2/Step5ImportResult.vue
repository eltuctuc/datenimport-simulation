<script setup>
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ImportResultPanel from '@/components/shared/ImportResultPanel.vue'
import { useWizard } from '@/composables/useWizard'
import { useImportStore } from '@/stores/useImportStore'
import { ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(2)
const store = useImportStore()

const allRecords = ref([])
onMounted(async () => {
  const mod = await import('@/mock/trainingData2.json')
  allRecords.value = mod.default

  if (store.methode2.importResult) return

  const selected = allRecords.value.filter(r => store.methode2.selectedRecordIds.includes(r.id))
  const notSelected = allRecords.value.length - selected.length

  const errors = selected
    .filter(r => r.status === 'storniert' && !r.grundStornierung)
    .map(r => ({ recordId: r.id, message: `Pflichtfeld 'Stornierungsgrund' fehlt bei "${r.bezeichnung}"` }))

  const imported = selected.length - errors.length
  const noEnd = selected.filter(r => !r.enddatum).length
  const noSemNr = selected.filter(r => !r.seminarnummer).length
  const noOrt = selected.filter(r => !r.veranstaltungsort).length

  const result = {
    imported,
    skipped: notSelected,
    warnings: [
      noEnd > 0 ? { message: 'Enddatum fehlt', count: noEnd } : null,
      noSemNr > 0 ? { message: 'Seminarnummer nicht angegeben', count: noSemNr } : null,
      noOrt > 0 ? { message: 'Veranstaltungsort fehlt', count: noOrt } : null,
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
        <CardTitle>Schritt 5: Importergebnis</CardTitle>
        <CardDescription>Ergebnis des Datenimports aus Ihrer eigenen Excel-Datei.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <ImportResultPanel v-if="store.methode2.importResult" :result="store.methode2.importResult" />
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
