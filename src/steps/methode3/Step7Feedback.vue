<script setup>
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import FeedbackForm from '@/components/shared/FeedbackForm.vue'
import { useFeedbackStore } from '@/stores/useFeedbackStore'
import { useImportStore } from '@/stores/useImportStore'

const emit = defineEmits(['done'])
const feedbackStore = useFeedbackStore()
const importStore = useImportStore()

function onSubmit(data) {
  feedbackStore.setFeedback(3, data)
  importStore.resetMethode(3)
  emit('done')
}
</script>

<template>
  <div class="space-y-6">
    <Card class="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Schritt 7: Ihre Bewertung</CardTitle>
        <CardDescription>Wie haben Sie die KI-gestützte Import-Methode erlebt?</CardDescription>
      </CardHeader>
      <CardContent>
        <FeedbackForm :methode-nr="3" @submit="onSubmit" />
      </CardContent>
    </Card>
  </div>
</template>
