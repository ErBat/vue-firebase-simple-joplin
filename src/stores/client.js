import { ref } from 'vue'
import { defineStore } from 'pinia'
import { setItem, getItem } from "../services/localStorage"

const localState = getItem("Notes")

const defaultState = {
  currentNotebook: null,
  currentNote: null
}

const initialState = localState ? localState : defaultState
const initialNotebook = initialState.currentNotebook;
const initialNote = initialState.currentNote ? initialNotebook.notes.find(e => e.id === initialState.currentNote.id) : null;

const updateLocalStorage = (value) => {
  setItem("Notes", value)
}

export const useClientStore = defineStore('client', () => {
  const currentNotebook = ref(initialNotebook)
  const currentNote = ref(initialNote)
  function setCurrentNotebook(val) {
    currentNote.value = null
    currentNotebook.value = val;
    updateStore()
  }
  function setCurrentNote(val) {
    currentNote.value = val;
    updateStore()
  }
  function updateStore(){
    updateLocalStorage({
      currentNotebook: currentNotebook.value,
      currentNote: currentNote.value
    })
  }

  function $reset() {
    currentNote.value = null
    currentNotebook.value = null
    updateLocalStorage({
      currentNotebook: currentNotebook.value,
      currentNote: currentNote.value
    })
  }

  return { currentNotebook, currentNote, setCurrentNotebook, setCurrentNote, $reset, updateStore }
})
