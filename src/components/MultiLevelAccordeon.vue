<script setup>
import { computed, ref } from 'vue'
import { collection, doc, setDoc, deleteDoc, updateDoc  } from "firebase/firestore"; 
import { useFirestore, useCurrentUser } from 'vuefire'
import { useClientStore } from '../stores/client'
import MultiLevelAccordeon from './MultiLevelAccordeon.vue';

const db = useFirestore()
const user = useCurrentUser();
const clientStore = useClientStore()

const curHeight = ref("auto")
const mouseOver = ref(false)
const props = defineProps({
  node: Object,
  spacing: {
    type: Number,
    default: 0
  },
  visible: {
    default: true
  }
})

async function createChildNotebook(parentId){
  const name = prompt("Create notebook", "New notebook");
  const newDocRef = doc(collection(db, "notebooks"))
  await setDoc(newDocRef, {
    children: [],
    name: name,
    notes: [],
    user: user.value.uid,
    parent: parentId,
  })
}

async function deleteNotebook(notebookId){
  if(hasChildren){
    props.node.children.forEach(async obj => {
      const docRef = doc(collection(db, "notebooks"), obj.id)
      const parent = props.node.parent
      await updateDoc(docRef, {
          parent: parent
      });
    });
  }
  await deleteDoc(doc(collection(db, "notebooks"), notebookId))
  clientStore.setCurrentNotebook(null)
}

const hasChildren = computed(() => {
  const { children } = props.node
  return children && children.length > 0
})

const nodeMargin = computed(() => {
  return {
    'margin-left': `${props.spacing}px`
  }
})

const toggle = () => {
  if(curHeight.value) curHeight.value = 0;
  else curHeight.value = "auto";
}

function selectNotebook(notebook){
  clientStore.setCurrentNotebook(notebook)
}

const onHoverHandler = (e) =>{
  e.stopPropagation()
  mouseOver.value = true;
}
const onLeaveHandler = (e) =>{
  e.stopPropagation()
  mouseOver.value = false;
}
</script>

<template>
  <div @mouseover="onHoverHandler($event)" @mouseleave="onLeaveHandler($event)" class="wrapper" :style="nodeMargin" v-if="props.visible"> 
    <button class="fixed-wrapper" v-if="hasChildren" @click="toggle()">
      <span class="icon" v-if="curHeight">&#9662;</span>
      <span class="icon" v-else>&#9656;</span>
    </button>
    <button @click="selectNotebook(node)">
      {{ node.name ? node.name : "Unnamed notebook" }}
    </button>
    <div class="buttons">
      <button :class="{visibleOnHover: mouseOver, addIcon: true}" @click="createChildNotebook(node.id)">+</button>
      <button :class="{visibleOnHover: mouseOver, removeIcon: true}" @click="deleteNotebook(node.id)">🗑</button>
    </div>
    <template v-if="hasChildren">
      <MultiLevelAccordeon
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :spacing="10"
        :style="{'height': curHeight}"
        :visible="curHeight"
      /> 
    </template>
  </div>
</template>

<style scoped>
.addIcon, .removeIcon{
  opacity: 0;
  transition: opacity 300ms;
}
.visibleOnHover{
  opacity: 1;
}

.buttons{
  display: inline-block;
}
.fixed-wrapper{
  position: relative;
  display: block;
}
.wrapper{
  position: relative;
  display: block;
  transition: height 0.2s ease-out;
}
.icon{
  position: absolute;
  left: -15px;
  top: 3px;
}

.addIcon{
  font-size: 20px;
  margin: 0 10px;
  font-weight: 700;
}

.removeIcon{
  font-size: 20px;
  font-weight: 700
}
</style>