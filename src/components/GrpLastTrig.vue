<template>
  <group-container :x-size="2" :y-size="1" label="Trigger time">
      <textarea readonly class="lastTrigInput"  rows="4" :value="text"/>
  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'

defineProps({
  text: String
})

</script>

<style lang="scss" scoped>
.lastTrigInput{
    color: white;
  background-color: transparent;
  overflow: hidden;
  border-style: hidden;
  user-select: none;
  resize: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: default;
  -webkit-touch-callout: none;
  -ms-user-select: none;
  padding-top: 7px;
  font-size: 13px;
  line-height: normal;
    &:focus{
      outline: none;
    }
}
</style>
