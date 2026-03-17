<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FileDropzone from '@/components/shared/FileDropzone.vue'
import ProcessingAnimation from '@/components/shared/ProcessingAnimation.vue'
import { useWizard } from '@/composables/useWizard'
import { ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(1)

const file = ref(null)
const error = ref(null)
const processing = ref(false)

const EXCEL_TYPES = ['xlsx', 'xls']

function validate(f) {
  const ext = f?.name?.split('.').pop()?.toLowerCase()
  if (!EXCEL_TYPES.includes(ext)) {
    error.value = 'Bitte laden Sie eine Excel-Datei (.xlsx oder .xls) hoch.'
    return false
  }
  error.value = null
  return true
}

function onFileSelected(f) {
  file.value = f
  validate(f)
}

function startProcessing() {
  if (!file.value || !validate(file.value)) return
  processing.value = true
}

function onProcessingDone() {
  wizard.setFile(file.value.name)
  emit('next')
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 2: Befüllte Vorlage hochladen</CardTitle>
        <CardDescription>
          Laden Sie nun die ausgefüllte Excel-Vorlage hoch. Das System erkennt automatisch die Spalten
          und bereitet die Daten zur Kontrolle vor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="!processing">
          <FileDropzone
            v-model="file"
            accept=".xlsx,.xls"
            accept-label=".xlsx oder .xls"
            :error="error"
            @file-selected="onFileSelected"
          />

          <div class="mt-6 flex justify-end">
            <Button :disabled="!file || !!error" @click="startProcessing">
              Datei verarbeiten
              <ArrowRight class="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <ProcessingAnimation
          v-else
          label="Datei wird eingelesen …"
          :duration-ms="1400"
          :steps="['Dateiformat prüfen …', 'Spalten erkennen …', 'Daten validieren …', 'Abgleich mit Datenmodell …']"
          @done="onProcessingDone"
        />
      </CardContent>
    </Card>
  </div>
</template>
