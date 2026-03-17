<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import WizardStepper from '@/components/shared/WizardStepper.vue'
import Step1Upload from '@/steps/methode3/Step1Upload.vue'
import Step2AiAnalysis from '@/steps/methode3/Step2AiAnalysis.vue'
import Step3Mapping from '@/steps/methode3/Step3Mapping.vue'
import Step4Review from '@/steps/methode3/Step4Review.vue'
import Step5Confirmation from '@/steps/methode3/Step5Confirmation.vue'
import Step6ImportResult from '@/steps/methode3/Step6ImportResult.vue'
import Step7Feedback from '@/steps/methode3/Step7Feedback.vue'
import { useWizard } from '@/composables/useWizard'

const router = useRouter()
const wizard = useWizard(3)

const STEPS = [
  { label: 'Upload' },
  { label: 'KI-Analyse' },
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
        <h1 class="text-2xl font-bold tracking-tight">Methode 3 — Bild / PDF-Scan</h1>
        <p class="text-muted-foreground mt-1">Fotografieren oder scannen Sie eine Tabelle — die KI erkennt und extrahiert die Daten automatisch.</p>
      </div>

      <WizardStepper :steps="STEPS" :current-step="wizard.currentStep.value" />

      <div class="animate-slide-in">
        <Step1Upload v-if="wizard.currentStep.value === 1" @next="wizard.next()" />
        <Step2AiAnalysis v-else-if="wizard.currentStep.value === 2" @next="wizard.next()" />
        <Step3Mapping v-else-if="wizard.currentStep.value === 3" @next="wizard.next()" />
        <Step4Review v-else-if="wizard.currentStep.value === 4" @next="wizard.next()" />
        <Step5Confirmation v-else-if="wizard.currentStep.value === 5" @next="wizard.next()" @cancel="wizard.goTo(1); router.push('/')" />
        <Step6ImportResult v-else-if="wizard.currentStep.value === 6" @next="wizard.next()" />
        <Step7Feedback v-else-if="wizard.currentStep.value === 7" @done="router.push('/')" />
      </div>
    </div>
  </AppLayout>
</template>
