<template>
  <group-container :x-size="4" :y-size="3" label="Pump realtime">
    <label-container label="Voltage (V)" :labelStyle="labelStyle">
      <q-range
        v-model="pumpVoltage"
        :min="180"
        :max="320"
        vertical
        reverse
        :step="20"
        marker-labels
        thumb-color="orange"
        track-size="20px"
        thumb-size="30px"
        marker-labels-class="marker-labels-class"
        markers
        label-always
        readonly
        inner-track-color="light-blue-2"
        switch-label-side
      />
    </label-container>
    <label-container label="Power (W)" :labelStyle="labelStyle">
      <q-range
        v-model="pumpPower"
        :min="0"
        :max="1000"
        vertical
        reverse
        :step="100"
        marker-labels
        thumb-color="orange"
        track-size="20px"
        thumb-size="30px"
        marker-labels-class="marker-labels-class"
        markers
        readonly
        label-always
        inner-track-color="light-blue-2"
        switch-label-side
      />
    </label-container>
    <label-container label="Current (A)" :labelStyle="labelStyle">
      <q-range
        v-model="pumpCurrent"
        :min="0"
        :max="10"
        vertical
        marker-labels
        reverse
        :step="1"
        thumb-color="orange"
        track-size="20px"
        thumb-size="30px"
        marker-labels-class="marker-labels-class"
        markers
        label-always
        inner-track-color="light-blue-2"
        readonly
        switch-label-side
      />
    </label-container>
  </group-container>
</template>

<script setup>
import LabelContainer from './LabelContainer.vue'
import GroupContainer from './GroupContainer.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const labelStyle = {
  color: 'white',
  paddingBottom: '10px'
}

const pumpVoltage = computed(() => {
  return { min: 100, max: store.state.antifreezeState.ac0.voltage }
})
const pumpPower = computed(() => {
  return { min: 0, max: store.state.antifreezeState.ac0.power }
})
const pumpCurrent = computed(() => {
  return { min: 0, max: store.state.antifreezeState.ac0.current }
})

</script>

<style scoped>

</style>
