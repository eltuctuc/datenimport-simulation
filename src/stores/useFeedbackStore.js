import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFeedbackStore = defineStore('feedback', () => {
  const methode1 = ref(null)
  const methode2 = ref(null)
  const methode3 = ref(null)
  const comparativeFeedback = ref(null)

  function setFeedback(methode, data) {
    const payload = { ...data, submittedAt: new Date().toISOString() }
    if (methode === 1) methode1.value = payload
    if (methode === 2) methode2.value = payload
    if (methode === 3) methode3.value = payload
  }

  function setComparativeFeedback(data) {
    comparativeFeedback.value = { ...data, submittedAt: new Date().toISOString() }
  }

  function resetMethode(methode) {
    if (methode === 1) methode1.value = null
    if (methode === 2) methode2.value = null
    if (methode === 3) methode3.value = null
  }

  function resetAll() {
    methode1.value = null
    methode2.value = null
    methode3.value = null
    comparativeFeedback.value = null
  }

  const allCompleted = () => !!methode1.value && !!methode2.value && !!methode3.value

  return {
    methode1, methode2, methode3, comparativeFeedback,
    setFeedback, setComparativeFeedback, resetMethode, resetAll, allCompleted,
  }
}, {
  persist: true,
})
