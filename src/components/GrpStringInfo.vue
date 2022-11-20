<template>
  <group-container :x-size="2" :y-size="1" :label="label" >
    <div class="valueMain">{{value}}</div>
  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'

defineProps({
  label: String,
  value: {
    type: Number,
    default: 0
  }
})

</script>

<style scoped>
.valueMain{
  color: #36f62f;
  font-size: 45px;
  font-family: revert;
  font-weight: bold;
}
</style>
