<script setup>
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ImportConfirmationPanel from '@/components/shared/ImportConfirmationPanel.vue'
import { useImportStore } from '@/stores/useImportStore'

const emit = defineEmits(['next', 'cancel'])
const store = useImportStore()

const allRecords = ref([])
onMounted(async () => {
  const mod = await import('@/mock/trainingData3.json')
  allRecords.value = mod.default
})

const selectedRecords = computed(() =>
  allRecords.value.filter(r => store.methode3.selectedRecordIds.includes(r.id))
)
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 5: Import bestätigen</CardTitle>
        <CardDescription>Bitte bestätigen Sie die Übernahme der geprüften OCR-Daten.</CardDescription>
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
