<script setup>
import { useClientStore } from '../stores/client'
import { useFirestore} from 'vuefire'
import { collection, updateDoc, doc  } from "firebase/firestore"; 

const clientStore = useClientStore()
const db = useFirestore()

async function updateNote(){
  const notebookId = clientStore.currentNotebook.id
  const docRef = doc(collection(db, "notebooks"), notebookId)
  const notes = clientStore.currentNotebook.notes
  await updateDoc(docRef, {
      notes: notes
  });
  clientStore.updateStore()
}

</script>

<template >
  <div class="flex-column editor" v-if="clientStore.currentNote">
    <input class="titleInput" @input="updateNote()" v-model="clientStore.currentNote.title"/>
    <textarea class="contentInput" @input="updateNote()" v-model="clientStore.currentNote.content"/>
  </div>
</template>

<style scoped>
.editor{
  flex: auto;
  height: 100hv;
}
.titleInput{
  width: 100%;
  height: 65px;
  font-weight: bold;
  font-size: 17px;
}

.contentInput{
  width: 100%;
  height: 100%;
  font-size: 14px;
}

input, textarea{
  font-weight: 400;
  line-height: 150%;
  border: 1px solid #E1E1E1;
  background: #fff;
  color: #333;
  padding: 12px 20px 12px 20px;
  margin-bottom: 0;
  min-width: 100%;
  box-sizing:border-box;
}
</style>