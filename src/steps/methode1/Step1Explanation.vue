<script setup>
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileSpreadsheet, Upload, CheckSquare, ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 1: Vorlage herunterladen und ausfüllen</CardTitle>
        <CardDescription>
          Laden Sie die vorgefertigte Excel-Vorlage herunter. Diese enthält alle erforderlichen Spalten
          passend zum Datenmodell. Befüllen Sie die Vorlage mit den Weiterbildungsdaten Ihrer Mitarbeiter
          und laden Sie die ausgefüllte Datei im nächsten Schritt hoch.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Steps overview -->
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-muted/30">
            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Download class="h-5 w-5 text-primary" />
            </div>
            <p class="text-sm font-medium">1. Herunterladen</p>
            <p class="text-xs text-muted-foreground">Vorlage auf Ihrem Computer speichern</p>
          </div>
          <div class="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-muted/30">
            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet class="h-5 w-5 text-primary" />
            </div>
            <p class="text-sm font-medium">2. Ausfüllen</p>
            <p class="text-xs text-muted-foreground">Daten in Excel eintragen</p>
          </div>
          <div class="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-muted/30">
            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload class="h-5 w-5 text-primary" />
            </div>
            <p class="text-sm font-medium">3. Hochladen</p>
            <p class="text-xs text-muted-foreground">Befüllte Datei zurück ins System laden</p>
          </div>
        </div>

        <!-- Template info -->
        <div class="rounded-lg border p-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <FileSpreadsheet class="h-8 w-8 text-green-600 shrink-0" />
            <div>
              <p class="text-sm font-medium">Weiterbildungshistorie-Vorlage.xlsx</p>
              <p class="text-xs text-muted-foreground">Excel-Vorlage · 23 Spalten · enthält Hinweise und Beispielwerte</p>
            </div>
          </div>
          <a href="/assets/excel-vorlage-weiterbildung.xlsx" download>
            <Button>
              <Download class="h-4 w-4 mr-2" />
              Vorlage herunterladen
            </Button>
          </a>
        </div>

        <!-- Info badges -->
        <div class="flex flex-wrap gap-2">
          <Badge variant="outline" class="gap-1"><CheckSquare class="h-3 w-3" /> Pflichtfelder markiert</Badge>
          <Badge variant="outline" class="gap-1"><CheckSquare class="h-3 w-3" /> Dropdown-Listen integriert</Badge>
          <Badge variant="outline" class="gap-1"><CheckSquare class="h-3 w-3" /> Beispieldaten enthalten</Badge>
        </div>
      </CardContent>
    </Card>

    <div class="flex justify-end">
      <Button @click="emit('next')">
        Weiter zum Upload
        <ArrowRight class="h-4 w-4 ml-2" />
      </Button>
    </div>
  </div>
</template>
