<script setup>
import { ref, computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, HelpCircle, Sparkles } from 'lucide-vue-next'

const props = defineProps({
  mappings: { type: Array, required: true }, // columnMapping2.json oder columnMapping3.json
  modelValue: { type: Object, default: () => ({}) }, // { sourceColumn: targetField }
  showAiBadge: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const TARGET_FIELDS = [
  { value: 'bezeichnung',           label: 'Bezeichnung (Pflicht)' },
  { value: 'zusatzbezeichnung',     label: 'Zusatzbezeichnung' },
  { value: 'startdatum',            label: 'Startdatum (Pflicht)' },
  { value: 'enddatum',              label: 'Enddatum' },
  { value: 'beginnUhrzeit',         label: 'Beginn-Uhrzeit' },
  { value: 'endeUhrzeit',           label: 'Ende-Uhrzeit' },
  { value: 'status',                label: 'Status' },
  { value: 'seminartyp',            label: 'Seminartyp' },
  { value: 'seminarart',            label: 'Seminarart' },
  { value: 'seminarbereich',        label: 'Seminarbereich' },
  { value: 'veranstalter',          label: 'Veranstalter' },
  { value: 'veranstaltungsort',     label: 'Veranstaltungsort' },
  { value: 'kosten',                label: 'Kosten' },
  { value: 'teilnahmebescheinigung','label': 'Teilnahmebescheinigung' },
  { value: 'seminarnummer',         label: 'Seminarnummer' },
  { value: 'notizen',               label: 'Notizen' },
  { value: 'mitarbeiterId',         label: 'Mitarbeiter-ID' },
  { value: 'vorname',               label: 'Vorname' },
  { value: 'nachname',              label: 'Nachname' },
  { value: '__ignore',              label: '— Ignorieren —' },
]

const REQUIRED_FIELDS = ['bezeichnung', 'startdatum']

// Build local state from props.mappings + modelValue overrides
const local = ref(
  Object.fromEntries(
    props.mappings.map(m => [m.sourceColumn, props.modelValue[m.sourceColumn] ?? m.targetField ?? '__ignore'])
  )
)

function update(source, value) {
  local.value[source] = value
  emit('update:modelValue', { ...local.value })
}

const unmappedRequired = computed(() =>
  REQUIRED_FIELDS.filter(f => !Object.values(local.value).includes(f))
)

function effectiveConfidence(m) {
  if (m.confidence === 'none' && local.value[m.sourceColumn] && local.value[m.sourceColumn] !== '__ignore') {
    return 'manual'
  }
  return m.confidence
}
function confidenceLabel(c) {
  return { high: 'Sicher', medium: 'Unsicher', none: 'Nicht erkannt', manual: 'Manuell zugeordnet' }[c] ?? c
}
function confidenceVariant(c) {
  return { high: 'success', medium: 'warning', none: 'destructive', manual: 'success' }[c] ?? 'outline'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Warning banner for unmapped required -->
    <Alert v-if="unmappedRequired.length > 0" variant="warning">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Pflichtfelder nicht zugeordnet</AlertTitle>
      <AlertDescription>
        Folgende Pflichtfelder sind noch nicht zugeordnet:
        <strong>{{ unmappedRequired.map(f => TARGET_FIELDS.find(t => t.value === f)?.label || f).join(', ') }}</strong>
      </AlertDescription>
    </Alert>

    <div class="rounded-lg border overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-muted/50 border-b">
            <th class="text-left px-4 py-3 font-medium text-muted-foreground w-[35%]">Spalte in Datei</th>
            <th class="text-left px-4 py-3 font-medium text-muted-foreground w-[20%]">Erkennung</th>
            <th class="text-left px-4 py-3 font-medium text-muted-foreground">Zielfeld im System</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="m in mappings"
            :key="m.sourceColumn"
            class="border-b last:border-0 hover:bg-muted/20 transition-colors"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{{ m.sourceColumn }}</span>
                <Badge v-if="showAiBadge && m.aiSuggestion" variant="secondary" class="text-[10px] py-0 px-1.5">
                  <Sparkles class="h-2.5 w-2.5 mr-0.5" />KI
                </Badge>
              </div>
            </td>
            <td class="px-4 py-3">
              <Badge :variant="confidenceVariant(effectiveConfidence(m))" class="text-xs">
                <CheckCircle2 v-if="effectiveConfidence(m) === 'high' || effectiveConfidence(m) === 'manual'" class="h-3 w-3 mr-1" />
                <HelpCircle v-else-if="effectiveConfidence(m) === 'medium'" class="h-3 w-3 mr-1" />
                <AlertCircle v-else class="h-3 w-3 mr-1" />
                {{ confidenceLabel(effectiveConfidence(m)) }}
              </Badge>
            </td>
            <td class="px-4 py-3">
              <Select
                :model-value="local[m.sourceColumn] ?? '__ignore'"
                :class="local[m.sourceColumn] === '__ignore' ? 'text-muted-foreground' : ''"
                @update:model-value="v => update(m.sourceColumn, v)"
              >
                <option v-for="t in TARGET_FIELDS" :key="t.value" :value="t.value">
                  {{ t.label }}
                </option>
              </Select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-xs text-muted-foreground">
      {{ mappings.filter(m => local[m.sourceColumn] && local[m.sourceColumn] !== '__ignore').length }}
      von {{ mappings.length }} Spalten zugeordnet
    </p>
  </div>
</template>
