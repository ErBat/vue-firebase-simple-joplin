<script setup>
import MultiLevelAccordeon from './MultiLevelAccordeon.vue';

const props = defineProps({
  menu: Array,
})
</script>

<template>
    <template v-for="item in props.menu">
      <MultiLevelAccordeon :node="item"/>
    </template>

</template>