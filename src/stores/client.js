import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useClientStore = defineStore('client', () => {
  const currentNotebook = ref(null)
  const currentNote = ref(null)
  function setCurrentNotebook(val) {
    currentNote.value = null
    currentNotebook.value = val;
  }
  function setCurrentNote(val) {
    currentNote.value = val;
  }

  return { currentNotebook, currentNote, setCurrentNotebook, setCurrentNote }
})
