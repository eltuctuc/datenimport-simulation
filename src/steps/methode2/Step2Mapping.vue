<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ColumnMappingPanel from '@/components/shared/ColumnMappingPanel.vue'
import { useWizard } from '@/composables/useWizard'
import columnMapping2 from '@/mock/columnMapping2.json'
import { ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['next'])
const wizard = useWizard(2)

const mappings = ref(
  Object.fromEntries(columnMapping2.map(m => [m.sourceColumn, m.targetField ?? '__ignore']))
)

function next() {
  wizard.setMappings(mappings.value)
  emit('next')
}

// Check required fields are mapped
function hasMissing() {
  const vals = Object.values(mappings.value)
  return !vals.includes('bezeichnung') || !vals.includes('startdatum')
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Schritt 2: Spalten zuordnen</CardTitle>
        <CardDescription>
          Das System hat Ihre Datei analysiert und {{ columnMapping2.length }} Spalten gefunden.
          Nicht erkannte Spalten (rot markiert) müssen Sie manuell dem passenden Feld zuordnen.
          Pflichtfelder sind mit (Pflicht) gekennzeichnet.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <ColumnMappingPanel
          :mappings="columnMapping2"
          v-model="mappings"
          :show-ai-badge="false"
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
