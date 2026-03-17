<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import WizardStepper from '@/components/shared/WizardStepper.vue'
import Step1Upload from '@/steps/methode2/Step1Upload.vue'
import Step2Mapping from '@/steps/methode2/Step2Mapping.vue'
import Step3Review from '@/steps/methode2/Step3Review.vue'
import Step4Confirmation from '@/steps/methode2/Step4Confirmation.vue'
import Step5ImportResult from '@/steps/methode2/Step5ImportResult.vue'
import Step6Feedback from '@/steps/methode2/Step6Feedback.vue'
import { useWizard } from '@/composables/useWizard'

const router = useRouter()
const wizard = useWizard(2)

const STEPS = [
  { label: 'Upload' },
  { label: 'Zuordnung' },
  { label: 'Prüfen' },
  { label: 'Bestätigung' },
  { label: 'Ergebnis' },
  { label: 'Feedback' },
]
</script>

<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Methode 2 — Eigene Excel-Datei</h1>
        <p class="text-muted-foreground mt-1">Laden Sie Ihre eigene Excel-Datei hoch — das System erkennt die Spalten automatisch.</p>
      </div>

      <WizardStepper :steps="STEPS" :current-step="wizard.currentStep.value" />

      <div class="animate-slide-in">
        <Step1Upload v-if="wizard.currentStep.value === 1" @next="wizard.next()" />
        <Step2Mapping v-else-if="wizard.currentStep.value === 2" @next="wizard.next()" />
        <Step3Review v-else-if="wizard.currentStep.value === 3" @next="wizard.next()" />
        <Step4Confirmation v-else-if="wizard.currentStep.value === 4" @next="wizard.next()" @cancel="wizard.goTo(1); router.push('/')" />
        <Step5ImportResult v-else-if="wizard.currentStep.value === 5" @next="wizard.next()" />
        <Step6Feedback v-else-if="wizard.currentStep.value === 6" @done="router.push('/')" />
      </div>
    </div>
  </AppLayout>
</template>
