import { ref } from 'vue'

export function useFileUpload(acceptedTypes = []) {
  const file = ref(null)
  const isDragging = ref(false)
  const error = ref(null)

  function validate(f) {
    if (!f) return 'Keine Datei ausgewählt.'
    if (acceptedTypes.length > 0) {
      const ext = f.name.split('.').pop().toLowerCase()
      if (!acceptedTypes.includes(ext)) {
        return `Ungültiger Dateityp. Erlaubt: ${acceptedTypes.join(', ')}`
      }
    }
    return null
  }

  function handleFile(f) {
    const err = validate(f)
    if (err) { error.value = err; return false }
    file.value = f
    error.value = null
    return true
  }

  function onDrop(e) {
    isDragging.value = false
    const f = e.dataTransfer?.files?.[0]
    if (f) handleFile(f)
  }

  function onInput(e) {
    const f = e.target?.files?.[0]
    if (f) handleFile(f)
  }

  function reset() {
    file.value = null
    error.value = null
    isDragging.value = false
  }

  return { file, isDragging, error, onDrop, onInput, reset }
}
