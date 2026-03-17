<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import StarRating from '@/components/shared/StarRating.vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useImportStore } from '@/stores/useImportStore'
import { useFeedbackStore } from '@/stores/useFeedbackStore'
import { useMarkdownExport } from '@/composables/useMarkdownExport'
import { Download, RotateCcw, Info } from 'lucide-vue-next'

const router = useRouter()
const importStore = useImportStore()
const feedbackStore = useFeedbackStore()
const { download } = useMarkdownExport()

const allDone = computed(() => feedbackStore.allCompleted())

const compareForm = ref({
  bevorzugteMethode: null,
  begruendung: '',
})
const compareSubmitted = computed(() => !!feedbackStore.comparativeFeedback)

function submitCompare() {
  if (!compareForm.value.bevorzugteMethode) return
  feedbackStore.setComparativeFeedback(compareForm.value)
}

const showResetDialog = ref(false)
function doReset() {
  importStore.resetAll()
  feedbackStore.resetAll()
  showResetDialog.value = false
  router.push('/')
}

const METHODE_LABELS = {
  1: 'Methode 1 – Excel-Vorlage',
  2: 'Methode 2 – Eigene Excel',
  3: 'Methode 3 – Bild / PDF',
}
const DIMENSIONS = [
  { key: 'einfachheit', label: 'Einfachheit' },
  { key: 'praxisnaehe', label: 'Praxisnähe' },
  { key: 'neuartigkeit', label: 'Neuartigkeit' },
]

const completedCount = computed(() =>
  [feedbackStore.methode1, feedbackStore.methode2, feedbackStore.methode3].filter(Boolean).length
)
</script>

<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Auswertung</h1>
          <p class="text-muted-foreground text-sm mt-1">Vergleich der drei Import-Methoden</p>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" @click="download">
            <Download class="h-4 w-4 mr-2" />
            Als Markdown exportieren
          </Button>
          <Button variant="outline" class="text-destructive hover:text-destructive" @click="showResetDialog = true">
            <RotateCcw class="h-4 w-4 mr-2" />
            Zurücksetzen
          </Button>
        </div>
      </div>

      <!-- Progress -->
      <Alert v-if="completedCount < 3">
        <Info class="h-4 w-4" />
        <AlertDescription>
          {{ completedCount }} von 3 Methoden abgeschlossen.
          <span v-if="completedCount < 3"> Schließen Sie alle drei Methoden ab, um das vergleichende Fazit ausfüllen zu können.</span>
        </AlertDescription>
      </Alert>

      <!-- Comparative Fazit -->
      <Card v-if="allDone">
        <CardHeader>
          <CardTitle>Vergleichendes Fazit</CardTitle>
          <CardDescription>Welche Methode hat Ihnen insgesamt am besten gefallen?</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="!compareSubmitted" class="space-y-4">
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="n in [1, 2, 3]"
                :key="n"
                type="button"
                :class="[
                  'rounded-lg border-2 p-3 text-sm font-medium transition-all',
                  compareForm.bevorzugteMethode === n
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/40',
                ]"
                @click="compareForm.bevorzugteMethode = n"
              >
                {{ METHODE_LABELS[n] }}
              </button>
            </div>
            <Textarea
              v-model="compareForm.begruendung"
              placeholder="Begründung (optional) …"
              :rows="3"
            />
            <Button :disabled="!compareForm.bevorzugteMethode" @click="submitCompare">
              Fazit abgeben
            </Button>
          </div>

          <div v-else class="space-y-2">
            <p class="text-sm font-medium">Bevorzugte Methode:
              <Badge>{{ METHODE_LABELS[feedbackStore.comparativeFeedback.bevorzugteMethode] }}</Badge>
            </p>
            <p v-if="feedbackStore.comparativeFeedback.begruendung" class="text-sm text-muted-foreground">
              "{{ feedbackStore.comparativeFeedback.begruendung }}"
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Feedback comparison cards -->
      <div>
        <h2 class="text-lg font-semibold mb-4">Feedback je Methode</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card v-for="n in [1, 2, 3]" :key="n">
            <CardHeader class="pb-2">
              <CardTitle class="text-sm">{{ METHODE_LABELS[n] }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <template v-if="feedbackStore[`methode${n}`]">
                <div v-for="d in DIMENSIONS" :key="d.key" class="flex items-center justify-between gap-2">
                  <span class="text-xs text-muted-foreground">{{ d.label }}</span>
                  <StarRating :model-value="feedbackStore[`methode${n}`][d.key]" readonly size="sm" />
                </div>
                <Separator />
                <p v-if="feedbackStore[`methode${n}`].anmerkungen" class="text-xs text-muted-foreground italic">
                  "{{ feedbackStore[`methode${n}`].anmerkungen }}"
                </p>
                <p v-else class="text-xs text-muted-foreground">Keine Anmerkungen</p>
              </template>
              <p v-else class="text-xs text-muted-foreground italic">Noch nicht abgeschlossen</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Reset dialog -->
      <Dialog :open="showResetDialog" @update:open="showResetDialog = false">
        <div>
          <h3 class="text-lg font-semibold">Simulation zurücksetzen?</h3>
          <p class="text-sm text-muted-foreground mt-2">
            Alle Feedback-Daten und importierten Datensätze werden gelöscht.
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <div class="flex gap-3 mt-6">
            <Button variant="destructive" class="flex-1" @click="doReset">Ja, zurücksetzen</Button>
            <Button variant="outline" @click="showResetDialog = false">Abbrechen</Button>
          </div>
        </div>
      </Dialog>
    </div>
  </AppLayout>
</template>
