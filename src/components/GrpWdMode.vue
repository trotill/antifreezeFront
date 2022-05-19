<template>
  <group-container :x-size="2" :y-size="1" label="WD mode/bath pwr">
    <label-container label="Mode A/M" >
      <q-btn class="buttonDashboard" dense :color="(mode)?'grey':'green'"
             glossy unelevated  text-color="white" icon="back_hand"
             :label="footerMode" @click="changeMode((mode)?0:1)"/>
    </label-container>
    <label-container label="Bath pwr">
      <q-btn class="buttonDashboard" dense :color="(bath)?'grey':'green'"
             glossy unelevated text-color="white" icon="bathtub" @click="changeBathPwr((bath)?0:1)" label="bath"/>
    </label-container>
  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'
import LabelContainer from './LabelContainer.vue'
import { computed } from 'vue'

const props = defineProps({
  changeMode: Function,
  changeBathPwr: Function,
  bath: Number,
  mode: Number
})
const footerMode = computed(() => {
  return (props.mode === 0) ? 'auto' : 'man'
})

</script>

<style lang="scss" scoped>
@import "src/assets/main.scss";
</style>
