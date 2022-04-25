<template>
  <group-container :x-size="2" :y-size="1" label="Pump/heater status">
    <label-container label="Pump on/off" >
      <q-btn dense class="buttonDashboard" :color="(pumpState)?'green':'grey'" glossy unelevated  text-color="white" icon="water_drop" label="Pump"/>

    </label-container>
    <label-container label="Heater on/off" >
      <q-btn dense class="buttonDashboard" :color="(heatState)?'green':'grey'" glossy unelevated  text-color="white" icon="cable" label="Heat"/>
    </label-container>

  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'
import LabelContainer from './LabelContainer.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const pumpState = computed(() => {
  return store.state.antifreezeState.pumpWork
})

const heatState = computed(() => {
  return store.state.antifreezeState.relay.heater
})
</script>

<style lang="scss" scoped>
@import "src/assets/main.scss";
</style>
