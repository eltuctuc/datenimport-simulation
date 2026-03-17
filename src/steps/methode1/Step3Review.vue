<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ReviewTable from '@/components/shared/ReviewTable.vue'
import { useWizard } from '@/composables/useWizard'
import { useImportStore } from '@/stores/useImportStore'
import trainingData1 from '@/mock/trainingData1.json'
import { ArrowRight, Info } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(1)
const store = useImportStore()

const selectedIds = ref(trainingData1.map(r => r.id))
const corrections = ref({})

function next() {
  wizard.setSelected(selectedIds.value)
  store.methode1.dropdownCorrections = corrections.value
  emit('next')
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 3: Daten prüfen und auswählen</CardTitle>
        <CardDescription>
          Das System hat {{ trainingData1.length }} Datensätze aus Ihrer Excel-Datei erkannt.
          Prüfen Sie die Einträge, korrigieren Sie ggf. Kategoriefelder über die Dropdowns
          und wählen Sie aus, welche Datensätze übernommen werden sollen.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <Alert>
          <Info class="h-4 w-4" />
          <AlertDescription>
            Felder mit <strong>⚠</strong> enthalten Werte, die nicht dem Systemvokabular entsprechen.
            Bitte korrigieren Sie diese vor dem Import.
          </AlertDescription>
        </Alert>

        <ReviewTable
          :records="trainingData1"
          v-model="selectedIds"
          v-model:corrections="corrections"
        />

        <div class="flex items-center justify-between pt-2">
          <p class="text-sm text-muted-foreground">
            <strong>{{ selectedIds.length }}</strong> von {{ trainingData1.length }} Datensätzen ausgewählt
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
