<script setup>
import { computed } from 'vue'
import { useFirestore, useFirebaseAuth, useCurrentUser, useCollection } from 'vuefire'
import { useRouter } from 'vue-router'
import { collection, addDoc, query, where,  } from "firebase/firestore"; 
import { signOut } from "firebase/auth";
import NotebookList from './NotebookList.vue';
import NoteList from './NoteList.vue';
import NoteEditor from './NoteEditor.vue';

const router = useRouter();

const auth = useFirebaseAuth();
const user = useCurrentUser();

const db = useFirestore()

const notebooksQuery = query(
    collection(db, 'notebooks'),
    where('user', '==', user.value ? user.value.uid : null)
  )

const notebooks = useCollection(notebooksQuery)

const menu = computed(() => {
  if(!notebooks.value) return {};
  return nestObjects(notebooks.value);
})

function logOut(){
  signOut(auth).then(() => {
    // Sign-out successful.
    router.push('/login')
  }).catch((error) => {
    // An error happened.
  }); 
}

function nestObjects(arr) {
  let tree = [];
  let lookup = {};

  arr.forEach(obj => {
    const { id, parent, children, ...rest } = obj;
    lookup[id] = { id, parent: parent || null, children: [], ...rest };
  });

  Object.keys(lookup).forEach(id => {
    const obj = lookup[id];
    if (obj.parent) {
      const parent = lookup[obj.parent];
      parent.children.push(obj);
    } else {
      tree.push(obj);
    }
  });
  return tree;
}

async function createNotebook(){
  const name = prompt("Create notebook", "New note");
  await addDoc(collection(db, "notebooks"), {
    user: user.value.uid,
    name: name,
    notes: [],
    children: []
  });
  notebookName.value = ""
}
</script>

<template>
  <div class="container">
    <div class="flex-row mainScreen">
      <div class="flex-column menu">
        <template v-if="user">
          <div>
            <p >Logged as <strong>{{ user.email }}</strong> / <a href="#" @click="logOut()">Log Out</a></p>
          </div> 
        </template>
        <div class="flex-row title-menu">
          <h2>Notebooks</h2>
          <button class="addIcon" @click="createNotebook()" >+</button>
        </div>
        <NotebookList :menu="menu"/>
      </div>
      <NoteList/>
      <NoteEditor/>
    </div>
  </div>
</template>

<style scoped>
.mainScreen{
  height: 100vh;
}
.menu{
  background-color: #444;
  color: #fff;
  padding: 5px 20px 0 25px;
  overflow: scroll;
  max-width: 300px;
}
.menu a{
  color: #fff;
}
.title-menu h2{
  text-transform: uppercase;
  font-weight: bold;
}
.title-menu{
  position: relative;
}
.addIcon{
  position: absolute;
  top: 10px;
  right: 0;
  font-size: 30px;
  font-weight: 700;
}
</style>