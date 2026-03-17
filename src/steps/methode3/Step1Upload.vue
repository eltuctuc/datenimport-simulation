<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import FileDropzone from '@/components/shared/FileDropzone.vue'
import { useWizard } from '@/composables/useWizard'
import { Download, ScanLine, ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(3)

const file = ref(null)
const error = ref(null)

const ACCEPTED = ['jpg', 'jpeg', 'png', 'pdf']

function onFileSelected(f) {
  const ext = f?.name?.split('.').pop()?.toLowerCase()
  if (!ACCEPTED.includes(ext)) {
    error.value = 'Erlaubt sind: JPG, PNG oder PDF'
    file.value = null
    return
  }
  error.value = null
  file.value = f
}

function proceed() {
  if (!file.value) return
  wizard.setFile(file.value.name)
  emit('next')
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <CardTitle>Schritt 1: Scan oder Foto hochladen</CardTitle>
          <Badge variant="secondary" class="gap-1"><ScanLine class="h-3 w-3" />KI-gestützt</Badge>
        </div>
        <CardDescription>
          Laden Sie ein Foto oder einen Scan einer Weiterbildungstabelle hoch.
          Unsere KI erkennt die Tabellenstruktur automatisch — auch bei handschriftlichen Notizen
          oder leicht schräg fotografierten Seiten.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <FileDropzone
          v-model="file"
          accept=".jpg,.jpeg,.png,.pdf"
          accept-label="JPG, PNG oder PDF — auch Handyfotos von Tabellenausdrucken"
          :error="error"
          @file-selected="onFileSelected"
        />

        <div class="space-y-1">
          <p class="text-xs text-muted-foreground font-medium">Beispieldateien für die Simulation:</p>
          <div class="flex flex-wrap gap-3 text-xs">
            <a href="/assets/scan-weiterbildung-1.jpg" download class="text-primary hover:underline flex items-center gap-1">
              <Download class="h-3 w-3" /> Scan Seite 1 (JPG)
            </a>
            <a href="/assets/scan-weiterbildung-2.jpg" download class="text-primary hover:underline flex items-center gap-1">
              <Download class="h-3 w-3" /> Scan Seite 2 (JPG)
            </a>
            <a href="/assets/scan-weiterbildung-3.jpg" download class="text-primary hover:underline flex items-center gap-1">
              <Download class="h-3 w-3" /> Scan Seite 3 (JPG)
            </a>
            <a href="/assets/scan-weiterbildung.pdf" download class="text-primary hover:underline flex items-center gap-1">
              <Download class="h-3 w-3" /> Komplett-Scan (PDF, 3 Seiten)
            </a>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <Button :disabled="!file || !!error" @click="proceed">
            KI-Analyse starten
            <ArrowRight class="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
