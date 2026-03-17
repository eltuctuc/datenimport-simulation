<script setup>
import { ref, computed } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
  records: { type: Array, required: true },
  selectable: { type: Boolean, default: true },
  modelValue: { type: Array, default: () => [] }, // selected ids
  corrections: { type: Object, default: () => ({}) },
  pageSize: { type: Number, default: 15 },
})
const emit = defineEmits(['update:modelValue', 'update:corrections'])

const page = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.records.length / props.pageSize)))
const pageRecords = computed(() => {
  const start = (page.value - 1) * props.pageSize
  return props.records.slice(start, start + props.pageSize)
})

// Selection
const selectedIds = computed(() => new Set(props.modelValue))

function toggleAll() {
  if (allPageSelected.value) {
    const pageIds = new Set(pageRecords.value.map(r => r.id))
    emit('update:modelValue', props.modelValue.filter(id => !pageIds.has(id)))
  } else {
    const newIds = new Set(props.modelValue)
    pageRecords.value.forEach(r => newIds.add(r.id))
    emit('update:modelValue', [...newIds])
  }
}

function toggleOne(id) {
  const set = new Set(props.modelValue)
  set.has(id) ? set.delete(id) : set.add(id)
  emit('update:modelValue', [...set])
}

const allPageSelected = computed(() =>
  pageRecords.value.length > 0 && pageRecords.value.every(r => selectedIds.value.has(r.id))
)
const somePageSelected = computed(() =>
  pageRecords.value.some(r => selectedIds.value.has(r.id)) && !allPageSelected.value
)

// Dropdown corrections
const SEMINARTYP_OPTIONS = ['Fachseminar', 'Workshop', 'Webinar', 'Pflichtschulung', 'E-Learning']
const SEMINARART_OPTIONS = ['Präsenz', 'Online', 'Hybrid']
const SEMINARBEREICH_OPTIONS = ['IT', 'Recht', 'Management', 'Soft Skills', 'Compliance']

function isUnknownValue(field, value) {
  if (field === 'seminartyp') return !SEMINARTYP_OPTIONS.includes(value)
  if (field === 'seminarart') return !SEMINARART_OPTIONS.includes(value)
  if (field === 'seminarbereich') return !SEMINARBEREICH_OPTIONS.includes(value)
  return false
}

function getCorrection(recordId, field, fallback) {
  return props.corrections?.[recordId]?.[field] ?? fallback
}

function setCorrection(recordId, field, value) {
  const updated = { ...props.corrections }
  if (!updated[recordId]) updated[recordId] = {}
  updated[recordId][field] = value
  emit('update:corrections', updated)
}

function statusVariant(s) {
  return { abgeschlossen: 'success', geplant: 'secondary', storniert: 'destructive', 'in Bearbeitung': 'warning' }[s] ?? 'outline'
}

function formatDate(d) {
  if (!d) return '–'
  try { return new Date(d).toLocaleDateString('de-DE') } catch { return d }
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between text-xs text-muted-foreground">
      <span>{{ records.length }} Datensätze</span>
      <span v-if="selectable">{{ modelValue.length }} ausgewählt</span>
    </div>

    <div class="rounded-lg border overflow-auto">
      <table class="w-full text-xs">
        <thead>
          <tr class="bg-muted/50 border-b">
            <th v-if="selectable" class="px-3 py-2 w-8">
              <Checkbox
                :model-value="allPageSelected"
                :class="somePageSelected ? 'opacity-50' : ''"
                @update:model-value="toggleAll"
              />
            </th>
            <th class="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">MA-ID</th>
            <th class="text-left px-3 py-2 font-medium text-muted-foreground">Bezeichnung</th>
            <th class="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">Startdatum</th>
            <th class="text-left px-3 py-2 font-medium text-muted-foreground">Status</th>
            <th class="text-left px-3 py-2 font-medium text-muted-foreground">Seminartyp</th>
            <th class="text-left px-3 py-2 font-medium text-muted-foreground">Seminarart</th>
            <th class="text-left px-3 py-2 font-medium text-muted-foreground">Bereich</th>
            <th class="text-left px-3 py-2 font-medium text-muted-foreground">Veranstalter</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in pageRecords"
            :key="r.id"
            :class="[
              'border-b last:border-0 transition-colors',
              selectable && selectedIds.has(r.id) ? 'bg-primary/5' : 'hover:bg-muted/20',
            ]"
          >
            <td v-if="selectable" class="px-3 py-2">
              <Checkbox
                :model-value="selectedIds.has(r.id)"
                @update:model-value="toggleOne(r.id)"
              />
            </td>
            <td class="px-3 py-2 font-mono text-muted-foreground">{{ r.mitarbeiterId }}</td>
            <td class="px-3 py-2 max-w-[200px]">
              <p class="truncate font-medium" :title="r.bezeichnung">{{ r.bezeichnung }}</p>
              <p v-if="r.zusatzbezeichnung" class="text-muted-foreground truncate" :title="r.zusatzbezeichnung">{{ r.zusatzbezeichnung }}</p>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">{{ formatDate(r.startdatum) }}</td>
            <td class="px-3 py-2">
              <Badge :variant="statusVariant(r.status)" class="text-[10px] py-0">{{ r.status }}</Badge>
            </td>

            <!-- Seminartyp dropdown -->
            <td class="px-3 py-2">
              <div class="flex items-center gap-1">
                <AlertTriangle
                  v-if="selectable && isUnknownValue('seminartyp', getCorrection(r.id, 'seminartyp', r.seminartyp))"
                  class="h-3 w-3 text-amber-500 shrink-0"
                />
                <Select
                  v-if="selectable"
                  :model-value="getCorrection(r.id, 'seminartyp', r.seminartyp)"
                  class="h-7 text-xs min-w-[110px]"
                  @update:model-value="v => setCorrection(r.id, 'seminartyp', v)"
                >
                  <option v-for="o in SEMINARTYP_OPTIONS" :key="o" :value="o">{{ o }}</option>
                  <option v-if="isUnknownValue('seminartyp', r.seminartyp)" :value="r.seminartyp">{{ r.seminartyp }} ⚠</option>
                </Select>
                <span v-else class="text-muted-foreground">{{ r.seminartyp }}</span>
              </div>
            </td>

            <!-- Seminarart dropdown -->
            <td class="px-3 py-2">
              <Select
                v-if="selectable"
                :model-value="getCorrection(r.id, 'seminarart', r.seminarart)"
                class="h-7 text-xs min-w-[90px]"
                @update:model-value="v => setCorrection(r.id, 'seminarart', v)"
              >
                <option v-for="o in SEMINARART_OPTIONS" :key="o" :value="o">{{ o }}</option>
              </Select>
              <span v-else class="text-muted-foreground">{{ r.seminarart }}</span>
            </td>

            <!-- Seminarbereich dropdown -->
            <td class="px-3 py-2">
              <Select
                v-if="selectable"
                :model-value="getCorrection(r.id, 'seminarbereich', r.seminarbereich)"
                class="h-7 text-xs min-w-[100px]"
                @update:model-value="v => setCorrection(r.id, 'seminarbereich', v)"
              >
                <option v-for="o in SEMINARBEREICH_OPTIONS" :key="o" :value="o">{{ o }}</option>
              </Select>
              <span v-else class="text-muted-foreground">{{ r.seminarbereich }}</span>
            </td>

            <td class="px-3 py-2 max-w-[140px]">
              <p class="truncate text-muted-foreground" :title="r.veranstalter">{{ r.veranstalter || '–' }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" :disabled="page === 1" @click="page--">Zurück</Button>
      <span class="text-sm text-muted-foreground">Seite {{ page }} / {{ totalPages }}</span>
      <Button variant="outline" size="sm" :disabled="page === totalPages" @click="page++">Weiter</Button>
    </div>
  </div>
</template>
