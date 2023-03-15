<script setup>
import { useClientStore } from '../stores/client'
import { useFirestore} from 'vuefire'
import { collection, updateDoc, doc  } from "firebase/firestore"; 

const clientStore = useClientStore()
const db = useFirestore()

async function addNote(){
  const name = prompt("Create note", "New note");
  const notebook = clientStore.currentNotebook
  const notebookId = notebook.id
  const docRef = doc(collection(db, "notebooks"), notebookId)
  const notes = notebook.notes
  notes.push({title: name, content: "", id: new Date().valueOf()})
  await updateDoc(docRef, {
      notes: notes
  });
}

function deleteNote(note){
  const notes = clientStore.currentNotebook.notes
  var index = notes.indexOf(note);
  notes.splice(index, 1);
  updateNote();
  clientStore.setCurrentNote(null)
}

async function updateNote(){
  const notebookId = clientStore.currentNotebook.id
  const docRef = doc(collection(db, "notebooks"), notebookId)
  const notes = clientStore.currentNotebook.notes
  await updateDoc(docRef, {
      notes: notes
  });
}

async function changeNotebookName(){
  const notebookId = clientStore.currentNotebook.id
  const docRef = doc(collection(db, "notebooks"), notebookId)
  const name = clientStore.currentNotebook.name
  await updateDoc(docRef, {
      name: name
  });
  clientStore.updateStore()
}

function selectNote(note){
  clientStore.setCurrentNote(note)
}
</script>

<template >
  <div class="flex-column list" v-if="clientStore.currentNotebook">
    <div class="menu">
      <button class="addNote" @click="addNote()">+</button>
      <input class="titleInput" @input="changeNotebookName()" v-model="clientStore.currentNotebook.name"/>
    </div>
    <div class="note" v-for="note in clientStore.currentNotebook?.notes">
      <button class="selectButton" @click="selectNote(note)">{{ note.title }}</button>
      <button class="deleteButton" @click="deleteNote(note)">🗑</button>
    </div>
    
  </div>
</template>

<style scoped>
.titleInput{
  font-weight: bold;
  font-size: 17px;
}

input{
  border: 1px solid #E1E1E1;
  background: #fff;
  color: #333;
  margin-bottom: 0;
}
.selectButton{
  width: 80%;
  height: 100%;
  text-align: left;
  padding: 15px;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
}
.deleteButton{
  width: 20%;
  font-size: 20px;
  font-weight: 700;
  border-left: 1px solid#e2e2e2;
  height: 100%;
}
.note{
  display: flex;
  flex-direction: row;
  text-align: left;
  border-bottom: 1px solid #e2e2e2;
}

.note:hover{
  background-color: #c5c5d8;
}
.list{
  width: 350px;
}
.addNote{
  color: #fff;
  background: #0f0ade;
  width: 30px;
  height: 30px;
  font-weight: bold;
  font-size: 20px;
}
.menu{
  padding: 15px;
  display: flex;
  border-bottom: 1px solid #e2e2e2;
}
</style>