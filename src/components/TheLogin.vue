<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFirebaseAuth, getCurrentUser } from 'vuefire'
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import VButton from './utils/VButton.vue';

const auth = useFirebaseAuth();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false)
const errors = ref('')

function loginUser(e){
  e.preventDefault();
  loading.value = true;
  errors.value = '';
  signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    loading.value = false;
    router.push(route.query.redirect || '/')
  })
  .catch((error) => {
    loading.value = false;
    errors.value = error.message;
  });
}

onMounted(async () => {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    const to =
      route.query.redirect && typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/'

    router.push(to)
  }
})

</script>

<template>
  <div class="container">
    <div class="flex-column centered">
      <h1>Login</h1>
      <template v-if="errors">
        <p class="error">{{ errors }}</p>
      </template>
      <form>
        <input v-model="email" placeholder="email" />
        <input v-model="password" placeholder="password" type="password"/>
        <VButton :loading="loading" full-width @click="loginUser($event)">Submit</VButton>
      </form>
      <p>Not registered yet? <router-link to="/register">Register</router-link></p>
      
    </div>
  </div>
</template>

<style scoped>
.error{
  color: red;
}
.centered{
  margin: 0 auto;
  width: 300px;
}
input{
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  border: 1px solid #E1E1E1;
  background: #fff;
  color: #9F9F9F;
  padding: 12px 40px 12px 20px;
  margin-bottom: 20px;
  min-width: 100%;
  box-sizing:border-box;
}
input:focus {
  border-color: #B5B5B5;
  color: #343030;
}
</style>
