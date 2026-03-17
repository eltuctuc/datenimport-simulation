<script setup>
import { ref } from 'vue'
import { Upload, FileIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps({
  accept: { type: String, default: '*' },
  acceptLabel: { type: String, default: 'Alle Dateien' },
  modelValue: { type: Object, default: null },
  error: { type: String, default: null },
})
const emit = defineEmits(['update:modelValue', 'file-selected'])

const isDragging = ref(false)
const inputRef = ref(null)

function handleFile(file) {
  if (!file) return
  emit('update:modelValue', file)
  emit('file-selected', file)
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function onInput(e) {
  const file = e.target?.files?.[0]
  if (file) handleFile(file)
}
</script>

<template>
  <div
    :class="cn(
      'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
      isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30',
      error ? 'border-destructive' : '',
    )"
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop.prevent="onDrop"
    @click="inputRef?.click()"
  >
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      class="hidden"
      @change="onInput"
    />

    <div v-if="!modelValue" class="flex flex-col items-center gap-3">
      <div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
        <Upload class="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p class="text-sm font-medium">Datei hierher ziehen oder klicken</p>
        <p class="text-xs text-muted-foreground mt-1">{{ acceptLabel }}</p>
      </div>
    </div>

    <div v-else class="flex items-center justify-center gap-3">
      <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <FileIcon class="h-5 w-5 text-primary" />
      </div>
      <div class="text-left">
        <p class="text-sm font-medium">{{ modelValue.name }}</p>
        <p class="text-xs text-muted-foreground">{{ (modelValue.size / 1024).toFixed(1) }} KB — klicken zum Ändern</p>
      </div>
    </div>
  </div>

  <p v-if="error" class="mt-2 text-xs text-destructive">{{ error }}</p>
</template>
