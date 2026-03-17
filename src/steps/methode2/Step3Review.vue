<script setup>
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ReviewTable from '@/components/shared/ReviewTable.vue'
import { useWizard } from '@/composables/useWizard'
import { useImportStore } from '@/stores/useImportStore'
import { ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(2)
const store = useImportStore()

// Lazy-load trainingData2 (100 records)
const records = ref([])
onMounted(async () => {
  const mod = await import('@/mock/trainingData2.json')
  records.value = mod.default
  // Pre-select all
  if (store.methode2.selectedRecordIds.length === 0) {
    selectedIds.value = records.value.map(r => r.id)
  } else {
    selectedIds.value = [...store.methode2.selectedRecordIds]
  }
})

const selectedIds = ref([])
const corrections = ref({})

function next() {
  wizard.setSelected(selectedIds.value)
  store.setDropdownCorrections(2, corrections.value)
  emit('next')
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 3: Daten prüfen und auswählen</CardTitle>
        <CardDescription>
          Das System hat {{ records.length }} Datensätze aus Ihrer Datei eingelesen.
          Prüfen und korrigieren Sie die Daten. Die Tabelle ist seitenweise aufgebaut (15 pro Seite).
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
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
