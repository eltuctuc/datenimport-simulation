<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FileDropzone from '@/components/shared/FileDropzone.vue'
import ProcessingAnimation from '@/components/shared/ProcessingAnimation.vue'
import { useWizard } from '@/composables/useWizard'
import { Download, ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(2)

const file = ref(null)
const error = ref(null)
const processing = ref(false)

function onFileSelected(f) {
  const ext = f?.name?.split('.').pop()?.toLowerCase()
  if (!['xlsx', 'xls'].includes(ext)) {
    error.value = 'Bitte laden Sie eine Excel-Datei (.xlsx oder .xls) hoch.'
    return
  }
  error.value = null
  file.value = f
}

function startProcessing() {
  if (!file.value || error.value) return
  processing.value = true
}

function onDone() {
  wizard.setFile(file.value.name)
  emit('next')
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 1: Eigene Excel-Datei hochladen</CardTitle>
        <CardDescription>
          Laden Sie Ihre selbst erstellte Excel-Datei hoch. Das System erkennt die Spalten automatisch
          und schlägt Ihnen passende Felder aus dem Datenmodell vor. Nicht erkannte Spalten können
          Sie im nächsten Schritt manuell zuordnen.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-if="!processing">
          <FileDropzone
            v-model="file"
            accept=".xlsx,.xls"
            accept-label=".xlsx oder .xls — eigene Spaltenstruktur erlaubt"
            :error="error"
            @file-selected="onFileSelected"
          />

          <div class="mt-3 flex items-center justify-between">
            <a href="/assets/excel-import-weiterbildung.xlsx" download class="text-xs text-primary hover:underline flex items-center gap-1">
              <Download class="h-3 w-3" /> Beispiel-Excel herunterladen
            </a>
          </div>

          <div class="mt-6 flex justify-end">
            <Button :disabled="!file || !!error" @click="startProcessing">
              Datei analysieren
              <ArrowRight class="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <ProcessingAnimation
          v-else
          label="Datei wird analysiert …"
          :duration-ms="1800"
          :steps="['Datei einlesen …', 'Spalten erkennen …', 'Ähnlichkeiten berechnen …', 'Zuordnungsvorschläge erstellen …', 'Analyse abgeschlossen']"
          @done="onDone"
        />
      </CardContent>
    </Card>
  </div>
</template>
