import { computed } from 'vue'
import { useImportStore } from '@/stores/useImportStore'

export function useWizard(methodeNr) {
  const store = useImportStore()

  const state = computed(() => store.getMethode(methodeNr))
  const currentStep = computed(() => state.value.currentStep)

  function next() { store.nextStep(methodeNr) }
  function goTo(step) { store.setStep(methodeNr, step) }

  function setFile(name) { store.setUploadedFile(methodeNr, name) }
  function setMappings(m) { store.setColumnMappings(methodeNr, m) }
  function setSelected(ids) { store.setSelectedRecords(methodeNr, ids) }
  function setResult(r) { store.setImportResult(methodeNr, r) }
  function addRecords(records) { store.addImportedRecords(records) }

  return { state, currentStep, next, goTo, setFile, setMappings, setSelected, setResult, addRecords }
}
