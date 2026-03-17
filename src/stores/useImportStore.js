import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

const createMethodeState = () => ({
  currentStep: 1,
  uploadedFileName: null,
  columnMappings: {},
  selectedRecordIds: [],
  dropdownCorrections: {},
  importResult: null,
  completed: false,
})

export const useImportStore = defineStore('import', () => {
  // Per-methode state
  const methode1 = reactive(createMethodeState())
  const methode2 = reactive(createMethodeState())
  const methode3 = reactive(createMethodeState())

  // Global imported records (persisted)
  const importedRecords = ref([])

  function getMethode(n) {
    return [null, methode1, methode2, methode3][n]
  }

  function setStep(methode, step) {
    getMethode(methode).currentStep = step
  }

  function nextStep(methode) {
    const m = getMethode(methode)
    m.currentStep++
  }

  function setUploadedFile(methode, name) {
    getMethode(methode).uploadedFileName = name
  }

  function setColumnMappings(methode, mappings) {
    getMethode(methode).columnMappings = { ...mappings }
  }

  function setSelectedRecords(methode, ids) {
    getMethode(methode).selectedRecordIds = [...ids]
  }

  function setDropdownCorrection(methode, recordId, field, value) {
    const m = getMethode(methode)
    if (!m.dropdownCorrections[recordId]) m.dropdownCorrections[recordId] = {}
    m.dropdownCorrections[recordId][field] = value
  }

  function setImportResult(methode, result) {
    getMethode(methode).importResult = result
    getMethode(methode).completed = true
  }

  function addImportedRecords(records) {
    importedRecords.value.push(...records)
  }

  function resetMethode(methode) {
    const m = getMethode(methode)
    Object.assign(m, createMethodeState())
  }

  function resetAll() {
    Object.assign(methode1, createMethodeState())
    Object.assign(methode2, createMethodeState())
    Object.assign(methode3, createMethodeState())
    importedRecords.value = []
  }

  return {
    methode1, methode2, methode3,
    importedRecords,
    getMethode,
    setStep, nextStep,
    setUploadedFile,
    setColumnMappings,
    setSelectedRecords,
    setDropdownCorrection,
    setImportResult,
    addImportedRecords,
    resetMethode,
    resetAll,
  }
}, {
  persist: true,
})
