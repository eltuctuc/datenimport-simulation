<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import MethodCard from '@/components/shared/MethodCard.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useImportStore } from '@/stores/useImportStore'
import { useFeedbackStore } from '@/stores/useFeedbackStore'
import { FileSpreadsheet, Upload, ScanLine, BarChart3 } from 'lucide-vue-next'

const router = useRouter()
const importStore = useImportStore()
const feedbackStore = useFeedbackStore()

const methoden = [
  {
    number: 1,
    title: 'Excel-Vorlage herunterladen & hochladen',
    description: 'Laden Sie unsere vorgefertigte Excel-Vorlage herunter, befüllen Sie diese offline und laden Sie die fertige Datei wieder hoch.',
    steps: ['Vorlage herunterladen', 'Vorlage in Excel ausfüllen', 'Datei hochladen', 'Daten prüfen & importieren'],
    icon: FileSpreadsheet,
    route: '/methode/1',
    storeKey: 'methode1',
    totalSteps: 6,
  },
  {
    number: 2,
    title: 'Eigene Excel-Datei hochladen',
    description: 'Laden Sie Ihre selbst erstellte Excel-Datei hoch. Das System erkennt die Spalten und schlägt Zuordnungen vor.',
    steps: ['Eigene Excel-Datei hochladen', 'Spalten zuordnen', 'Daten prüfen & importieren'],
    icon: Upload,
    route: '/methode/2',
    storeKey: 'methode2',
    totalSteps: 6,
  },
  {
    number: 3,
    title: 'Foto oder PDF-Scan importieren',
    description: 'Fotografieren Sie einfach eine Tabelle oder laden Sie einen PDF-Scan hoch — die KI erkennt und extrahiert die Daten.',
    steps: ['Bild / PDF hochladen', 'KI analysiert automatisch', 'Zuordnung prüfen', 'Daten importieren'],
    icon: ScanLine,
    route: '/methode/3',
    storeKey: 'methode3',
    totalSteps: 7,
  },
]

const completedCount = computed(() =>
  [feedbackStore.methode1, feedbackStore.methode2, feedbackStore.methode3].filter(Boolean).length
)

function startMethode(number, route) {
  importStore.resetMethode(number)
  feedbackStore.resetMethode(number)
  router.push(route)
}
</script>

<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <div class="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="secondary">Nutzerstudie · Simulation</Badge>
        <h1 class="text-3xl font-bold tracking-tight">Wie importieren Sie Weiterbildungsdaten?</h1>
        <p class="text-muted-foreground">
          Testen Sie drei verschiedene Methoden zum Import von Weiterbildungshistorien.
          Durchlaufen Sie jede Methode und geben Sie anschließend Ihr Feedback ab.
        </p>
      </div>

      <div class="flex items-center justify-center gap-4">
        <div class="flex items-center gap-2">
          <div class="h-2 w-32 rounded-full bg-border overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-500"
              :style="{ width: `${(completedCount / 3) * 100}%` }"
            />
          </div>
          <span class="text-sm text-muted-foreground">{{ completedCount }} / 3 abgeschlossen</span>
        </div>
        <Button v-if="completedCount > 0" variant="outline" size="sm" @click="router.push('/ergebnis')">
          <BarChart3 class="h-3.5 w-3.5 mr-1.5" />
          Zur Auswertung
        </Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MethodCard
          v-for="m in methoden"
          :key="m.number"
          :number="m.number"
          :title="m.title"
          :description="m.description"
          :steps="m.steps"
          :icon="m.icon"
          :completed="!!feedbackStore[`methode${m.number}`]"
          :in-progress="importStore[m.storeKey].currentStep > 1 && !feedbackStore[`methode${m.number}`]"
          :current-step="importStore[m.storeKey].currentStep"
          :total-steps="m.totalSteps"
          @start="startMethode(m.number, m.route)"
        />
      </div>

      <p class="text-center text-xs text-muted-foreground">
        Hierbei handelt es sich um eine Simulation. Es werden keine echten Daten importiert.
      </p>
    </div>
  </AppLayout>
</template>
