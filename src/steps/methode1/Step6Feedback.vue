<script setup>
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import FeedbackForm from '@/components/shared/FeedbackForm.vue'
import { useFeedbackStore } from '@/stores/useFeedbackStore'
import { useImportStore } from '@/stores/useImportStore'

const emit = defineEmits(['done'])
const feedbackStore = useFeedbackStore()
const importStore = useImportStore()

function onSubmit(data) {
  feedbackStore.setFeedback(1, data)
  importStore.resetMethode(1)
  emit('done')
}
</script>

<template>
  <div class="space-y-6">
    <Card class="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Schritt 6: Ihre Bewertung</CardTitle>
        <CardDescription>
          Wie haben Sie diese Import-Methode erlebt? Ihre Antworten helfen uns, das System zu verbessern.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FeedbackForm :methode-nr="1" @submit="onSubmit" />
      </CardContent>
    </Card>
  </div>
</template>
