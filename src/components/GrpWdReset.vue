<template>
  <group-container :x-size="2" :y-size="1" label="WD reset">
    <label-container label="Reset 12V" >
      <q-btn class="buttonDashboard" dense color="red"
             glossy unelevated text-color="white" icon="power"
             label="12V" @click="reset12V(1)"/>
    </label-container>
    <label-container label="Self reset">
      <q-btn class="buttonDashboard" dense color="red"
             glossy unelevated text-color="white" icon="power" @click="selfReset(0)" label="WD"/>
    </label-container>
  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'
import LabelContainer from './LabelContainer.vue'

defineProps({
  reset12V: Function,
  selfReset: Function
})

</script>

<style lang="scss" scoped>
@import "src/assets/main.scss";
</style>
