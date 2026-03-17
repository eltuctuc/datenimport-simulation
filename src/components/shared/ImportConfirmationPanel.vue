<script setup>
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-vue-next'

const props = defineProps({
  records: { type: Array, required: true }, // already-filtered selected records
})
const emit = defineEmits(['confirm', 'cancel'])

const showDetails = ref(false)
const showCancelDialog = ref(false)

const employeeCount = computed(() => new Set(props.records.map(r => r.mitarbeiterId)).size)

function formatDate(d) {
  if (!d) return '–'
  const parsed = new Date(d)
  return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString('de-DE')
}
</script>

<template>
  <div class="space-y-6">
    <Alert variant="warning">
      <AlertTriangle class="h-4 w-4" />
      <AlertTitle>Bitte überprüfen Sie Ihre Auswahl</AlertTitle>
      <AlertDescription>
        Sie sind dabei, <strong>{{ records.length }} Datensätze</strong> für <strong>{{ employeeCount }} Mitarbeiter</strong> in das System zu übernehmen.
        Dieser Vorgang kann nicht automatisch rückgängig gemacht werden.
      </AlertDescription>
    </Alert>

    <!-- Collapsible list -->
    <div class="rounded-lg border overflow-hidden">
      <button
        type="button"
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-muted/30 hover:bg-muted/50 transition-colors"
        @click="showDetails = !showDetails"
      >
        <span>Ausgewählte Datensätze ({{ records.length }})</span>
        <ChevronDown v-if="!showDetails" class="h-4 w-4 text-muted-foreground" />
        <ChevronUp v-else class="h-4 w-4 text-muted-foreground" />
      </button>

      <div v-if="showDetails" class="divide-y max-h-60 overflow-y-auto">
        <div
          v-for="r in records"
          :key="r.id"
          class="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted/20"
        >
          <div>
            <span class="font-medium">{{ r.bezeichnung }}</span>
            <span class="text-muted-foreground ml-2 text-xs">{{ r.mitarbeiterId }}</span>
          </div>
          <span class="text-xs text-muted-foreground whitespace-nowrap ml-4">
            {{ formatDate(r.startdatum) }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <Button class="flex-1" @click="emit('confirm')">
        <CheckCircle2 class="h-4 w-4 mr-2" />
        Daten übernehmen
      </Button>
      <Button variant="outline" class="text-destructive hover:text-destructive" @click="showCancelDialog = true">
        Import abbrechen
      </Button>
    </div>

    <!-- Cancel confirmation dialog -->
    <Dialog :open="showCancelDialog" @update:open="showCancelDialog = false">
      <div>
        <h3 class="text-lg font-semibold">Import wirklich abbrechen?</h3>
        <p class="text-sm text-muted-foreground mt-2">
          Alle bisherigen Eingaben dieses Imports gehen verloren. Sie kehren zur Startseite zurück.
        </p>
        <div class="flex gap-3 mt-6">
          <Button variant="destructive" class="flex-1" @click="emit('cancel')">Ja, abbrechen</Button>
          <Button variant="outline" @click="showCancelDialog = false">Zurück</Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
