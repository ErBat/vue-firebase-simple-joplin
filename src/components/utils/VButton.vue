<script setup lang="ts">
defineProps({
  disabled: Boolean,
  loading: Boolean,
  light: Boolean,
  fullWidth: Boolean
})
</script>

<template>
  <button :class="{ disabled: disabled || loading, light: light, fullWidth: fullWidth }" :disabled="disabled || loading"> 
    
    <div v-if="loading" class="lds-dual-ring"></div>
    <slot v-else />
  </button>
</template>
<style scoped>
button{
  font-size: 14px;
  font-weight: 700;
  color: #F4F6F9;
  background-color: #666666;
  white-space: nowrap;
  width: 118px;
  height: 48px;
  text-align: center;
}
.fullWidth{
  width: 100%;
}
.light{
  background: #d6d6d6;
}
button:hover{
  background-color: #6b6b6b;
}
.disabled{
  background-color: #C1B4B1;
  cursor: not-allowed;
}
button:hover.disabled{
  background-color: #C1B4B1;
}
.lds-dual-ring {
  display: inline-block;
  width: 20px;
  height: 20px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>