<script setup>
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ProcessingAnimation from '@/components/shared/ProcessingAnimation.vue'
import { Sparkles } from 'lucide-vue-next'

const emit = defineEmits(['next'])
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <CardTitle>Schritt 2: KI-Analyse läuft</CardTitle>
          <Badge variant="secondary" class="gap-1 animate-pulse">
            <Sparkles class="h-3 w-3" /> KI aktiv
          </Badge>
        </div>
        <CardDescription>
          Das System analysiert Ihr Bild / Ihre PDF. Die KI erkennt die Tabellenstruktur,
          liest Text aus und versucht, die Spalten automatisch dem Datenmodell zuzuordnen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProcessingAnimation
          label="KI analysiert das Dokument …"
          :duration-ms="3200"
          :steps="[
            'Dokument einlesen …',
            'Seitenorientierung prüfen …',
            'Tabellenstruktur erkennen …',
            'Text extrahieren (OCR) …',
            'Spaltenköpfe identifizieren …',
            'Spaltennamen mit Datenmodell abgleichen …',
            'KI-Zuordnungsvorschläge generieren …',
            'Analyse abgeschlossen ✓',
          ]"
          @done="emit('next')"
        />
      </CardContent>
    </Card>
  </div>
</template>
