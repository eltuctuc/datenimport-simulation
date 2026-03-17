<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ColumnMappingPanel from '@/components/shared/ColumnMappingPanel.vue'
import { useWizard } from '@/composables/useWizard'
import columnMapping3 from '@/mock/columnMapping3.json'
import { Sparkles, ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(3)

const mappings = ref(
  Object.fromEntries(columnMapping3.map(m => [m.sourceColumn, m.targetField ?? '__ignore']))
)

function hasMissing() {
  const vals = Object.values(mappings.value)
  return !vals.includes('bezeichnung') || !vals.includes('startdatum')
}

function next() {
  wizard.setMappings(mappings.value)
  emit('next')
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <CardTitle>Schritt 3: KI-Zuordnung prüfen</CardTitle>
          <Badge variant="secondary" class="gap-1"><Sparkles class="h-3 w-3" />KI-Vorschläge</Badge>
        </div>
        <CardDescription>
          Die KI hat {{ columnMapping3.length }} Spalten in Ihrem Dokument erkannt. Grün markierte Spalten wurden
          automatisch zugeordnet. Bitte prüfen Sie die KI-Vorschläge und ordnen Sie nicht erkannte Spalten manuell zu.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <Alert>
          <Sparkles class="h-4 w-4" />
          <AlertDescription>
            Spalten mit <Badge variant="secondary" class="text-[10px] py-0 mx-1"><Sparkles class="h-2.5 w-2.5 mr-0.5" />KI</Badge>
            wurden automatisch durch KI-Analyse vorgeschlagen. Bitte überprüfen Sie diese Zuordnungen.
          </AlertDescription>
        </Alert>

        <ColumnMappingPanel
          :mappings="columnMapping3"
          v-model="mappings"
          :show-ai-badge="true"
        />

        <div class="flex items-center justify-between pt-2">
          <p v-if="hasMissing()" class="text-xs text-destructive">
            Pflichtfelder (Bezeichnung, Startdatum) müssen zugeordnet sein.
          </p>
          <div v-else />
          <Button :disabled="hasMissing()" @click="next">
            Weiter zur Datenkontrolle
            <ArrowRight class="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
