<script setup>
import { onMounted, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ImportResultPanel from '@/components/shared/ImportResultPanel.vue'
import { useWizard } from '@/composables/useWizard'
import { useImportStore } from '@/stores/useImportStore'
import trainingData1 from '@/mock/trainingData1.json'
import { ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(1)
const store = useImportStore()

const selectedIds = computed(() => new Set(store.methode1.selectedRecordIds))
const selectedRecords = computed(() => trainingData1.filter(r => selectedIds.value.has(r.id)))
const skipped = computed(() => trainingData1.length - selectedRecords.value.length)

// Simulate import result
onMounted(() => {
  if (store.methode1.importResult) return

  const records = selectedRecords.value
  // Simulate: 1 error (storniert ohne Grund im Mock), rest ok with some warnings
  const errors = records
    .filter(r => r.status === 'storniert' && !r.grundStornierung)
    .map(r => ({ recordId: r.id, message: `Pflichtfeld 'Stornierungsgrund' fehlt bei "${r.bezeichnung}"` }))

  const imported = records.length - errors.length
  const withoutEndDate = records.filter(r => !r.enddatum && r.status !== 'storniert').length
  const withoutSeminarnr = records.filter(r => !r.seminarnummer).length

  const result = {
    imported,
    skipped: skipped.value,
    warnings: [
      withoutEndDate > 0 ? { message: 'Enddatum fehlt', count: withoutEndDate } : null,
      withoutSeminarnr > 0 ? { message: 'Seminarnummer nicht angegeben', count: withoutSeminarnr } : null,
    ].filter(Boolean),
    errors,
  }

  wizard.setResult(result)
  wizard.addRecords(records.slice(0, imported))
})
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 5: Importergebnis</CardTitle>
        <CardDescription>Hier sehen Sie das Ergebnis des Datenimports.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <ImportResultPanel v-if="store.methode1.importResult" :result="store.methode1.importResult" />

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
