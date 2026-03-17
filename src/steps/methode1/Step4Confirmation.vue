<script setup>
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ImportConfirmationPanel from '@/components/shared/ImportConfirmationPanel.vue'
import { useImportStore } from '@/stores/useImportStore'
import trainingData1 from '@/mock/trainingData1.json'

const emit = defineEmits(['next', 'cancel'])
const store = useImportStore()

const selectedRecords = computed(() =>
  trainingData1.filter(r => store.methode1.selectedRecordIds.includes(r.id))
)
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 4: Import bestätigen</CardTitle>
        <CardDescription>
          Bitte bestätigen Sie, dass die ausgewählten Datensätze in das System übernommen werden sollen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ImportConfirmationPanel
          :records="selectedRecords"
          @confirm="emit('next')"
          @cancel="emit('cancel')"
        />
      </CardContent>
    </Card>
  </div>
</template>
