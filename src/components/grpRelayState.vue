<template>
  <group-container :x-size="4" :y-size="1" label="Periphery state" >
    <label-container class="bitBlock" label="Pump relay" >
      <q-avatar :color="getColorByState(state.pump)" text-color="white" size="md" :icon="getIconByState(state.pump)" />
    </label-container>
    <label-container class="bitBlock" label="Heater relay">
      <q-avatar :color="getColorByState(state.heater)" text-color="white" size="md" :icon="getIconByState(state.heater)" />
    </label-container>
    <label-container class="bitBlock" label="220V">
      <q-avatar :color="getColorByState(state.v220)" text-color="white" size="md" :icon="getIconByState(state.v220)" />
    </label-container>
    <label-container class="bitBlock" label="Power">
      <q-avatar :color="getColorByState(state.pwrMeasure)" text-color="white" size="md" :icon="getIconByState(state.pwrMeasure)" />
    </label-container>
  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'
import LabelContainer from './LabelContainer.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const state = computed(() => {
  return {
    pump: store.state.antifreezeState.device.relayPumpAvail,
    heater: store.state.antifreezeState.device.relayHeaterAvail,
    v220: !store.state.antifreezeState.powerLoss,
    pwrMeasure: store.state.antifreezeState.device.acAvail
  }
})

const getColorByState = state => (state) ? 'green' : 'red'
const getIconByState = state => (state) ? 'done' : 'close'

</script>

<style scoped>
.bitBlock{
  width: 100px;
}
</style>
