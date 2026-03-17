<script setup>
import { ref, computed } from 'vue'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertTriangle, XCircle, SkipForward, ChevronDown, ChevronUp } from 'lucide-vue-next'

const props = defineProps({
  result: {
    type: Object,
    required: true,
    // { imported: Number, warnings: [{message, count}], errors: [{message, recordId}], skipped: Number }
  },
})

const showWarnings = ref(false)
const showErrors = ref(false)
</script>

<template>
  <div class="space-y-3">
    <!-- Success -->
    <div class="flex items-center gap-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
      <CheckCircle2 class="h-5 w-5 text-green-600 shrink-0" />
      <div>
        <p class="font-medium text-green-900">Erfolgreich importiert</p>
        <p class="text-sm text-green-700">{{ result.imported }} Datensätze wurden übernommen</p>
      </div>
      <Badge variant="success" class="ml-auto">{{ result.imported }}</Badge>
    </div>

    <!-- Warnings -->
    <div v-if="result.warnings?.length > 0" class="rounded-lg border border-amber-200 overflow-hidden">
      <button
        type="button"
        class="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 hover:bg-amber-100 transition-colors text-left"
        @click="showWarnings = !showWarnings"
      >
        <AlertTriangle class="h-4 w-4 text-amber-600 shrink-0" />
        <div class="flex-1">
          <p class="font-medium text-amber-900">Warnungen</p>
          <p class="text-xs text-amber-700">{{ result.warnings.reduce((s, w) => s + (w.count || 1), 0) }} Datensätze mit fehlenden Optionalfeldern</p>
        </div>
        <ChevronDown v-if="!showWarnings" class="h-4 w-4 text-amber-600" />
        <ChevronUp v-else class="h-4 w-4 text-amber-600" />
      </button>
      <div v-if="showWarnings" class="divide-y divide-amber-100 bg-white">
        <div v-for="(w, i) in result.warnings" :key="i" class="px-4 py-2 flex items-center justify-between text-sm">
          <span class="text-amber-800">{{ w.message }}</span>
          <Badge variant="warning">{{ w.count }}</Badge>
        </div>
      </div>
    </div>

    <!-- Errors -->
    <div v-if="result.errors?.length > 0" class="rounded-lg border border-red-200 overflow-hidden">
      <button
        type="button"
        class="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 transition-colors text-left"
        @click="showErrors = !showErrors"
      >
        <XCircle class="h-4 w-4 text-red-600 shrink-0" />
        <div class="flex-1">
          <p class="font-medium text-red-900">Fehler</p>
          <p class="text-xs text-red-700">{{ result.errors.length }} Datensätze konnten nicht importiert werden</p>
        </div>
        <ChevronDown v-if="!showErrors" class="h-4 w-4 text-red-600" />
        <ChevronUp v-else class="h-4 w-4 text-red-600" />
      </button>
      <div v-if="showErrors" class="divide-y divide-red-100 bg-white">
        <div v-for="(e, i) in result.errors" :key="i" class="px-4 py-2 text-sm">
          <p class="font-mono text-xs text-muted-foreground">{{ e.recordId }}</p>
          <p class="text-red-800">{{ e.message }}</p>
        </div>
      </div>
    </div>

    <!-- Skipped -->
    <div v-if="result.skipped > 0" class="flex items-center gap-3 rounded-lg border px-4 py-3 bg-muted/20">
      <SkipForward class="h-4 w-4 text-muted-foreground shrink-0" />
      <p class="text-sm text-muted-foreground">{{ result.skipped }} Datensätze wurden vom Nutzer nicht übernommen</p>
    </div>
  </div>
</template>
