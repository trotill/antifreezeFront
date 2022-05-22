<template>
  <group-container :x-size="2" :y-size="1" label="AF mode/algo">
    <label-container label="Mode A/M" >
      <q-btn class="buttonDashboard" dense :color="(modeStr!=='auto')?'grey':'green'"
             glossy unelevated  text-color="white" icon="back_hand"
             :label="modeStr" @click="changeMode((mode)?0:1)"/>
    </label-container>
    <label-container label="Algo stage">
      <q-btn class="buttonDashboard" dense :color="(algo)?'primary':'green'" text-color="white" icon="psychology" :label="'ST '+algo"/>
    </label-container>
  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'
import LabelContainer from './LabelContainer.vue'
import { computed } from 'vue'

const props = defineProps({
  changeMode: Function,
  algo: Number,
  mode: Number
})

const modeStr = computed(() => {
  return (props.mode === 0) ? 'auto' : 'man'
})

</script>

<style lang="scss" scoped>
@import "src/assets/main.scss";
</style>
