<script setup>
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ReviewTable from '@/components/shared/ReviewTable.vue'
import { useWizard } from '@/composables/useWizard'
import { useImportStore } from '@/stores/useImportStore'
import { AlertTriangle, ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(3)
const store = useImportStore()

const records = ref([])
onMounted(async () => {
  const mod = await import('@/mock/trainingData3.json')
  records.value = mod.default
  if (store.methode3.selectedRecordIds.length === 0) {
    selectedIds.value = records.value.map(r => r.id)
  } else {
    selectedIds.value = [...store.methode3.selectedRecordIds]
  }
})

const selectedIds = ref([])
const corrections = ref({})

function next() {
  wizard.setSelected(selectedIds.value)
  store.methode3.dropdownCorrections = corrections.value
  emit('next')
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 4: OCR-Daten prüfen und auswählen</CardTitle>
        <CardDescription>
          Die KI hat {{ records.length }} Datensätze aus Ihrem Dokument extrahiert.
          Bitte prüfen Sie die erkannten Daten besonders sorgfältig — OCR-Erkennung kann gelegentlich
          Lese- oder Formatierungsfehler erzeugen.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <Alert variant="warning">
          <AlertTriangle class="h-4 w-4" />
          <AlertDescription>
            Einige Felder enthalten möglicherweise OCR-Artefakte (z.B. abweichende Datumsformate oder Abkürzungen).
            Bitte kontrollieren Sie diese Einträge vor der Übernahme.
          </AlertDescription>
        </Alert>

        <ReviewTable
          :records="records"
          v-model="selectedIds"
          v-model:corrections="corrections"
          :page-size="15"
        />

        <div class="flex items-center justify-between pt-2">
          <p class="text-sm text-muted-foreground">
            <strong>{{ selectedIds.length }}</strong> von {{ records.length }} ausgewählt
          </p>
          <Button :disabled="selectedIds.length === 0" @click="next">
            Weiter zur Bestätigung
            <ArrowRight class="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
