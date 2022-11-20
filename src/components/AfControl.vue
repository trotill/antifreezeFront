<template>
  <q-dialog :value="dialog" @update:model-value="setDialog" position="bottom">
    <q-card class="card" >
      <q-card-section class="row items-center no-wrap">
        <group-container :x-size="3" :y-size="1" label="Control" >
          <label-container label="Pump relay">
            <q-btn round :color="getColorByState(state.pump)" size="lg" glossy text-color="white" icon="water_drop" />
          </label-container>
          <label-container label="Heater relay">
            <q-btn round :color="getColorByState(state.heater)" size="lg" glossy text-color="white" icon="cable" />
          </label-container>
          <label-container label="Manual mode">
            <q-btn round :color="getColorByState(state.v220)" size="lg" glossy text-color="white" icon="back_hand" />
          </label-container>
        </group-container>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import GroupContainer from './GroupContainer.vue'
import LabelContainer from './LabelContainer.vue'
import { reactive } from 'vue'

defineProps({
  dialog: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:model-value'])
function setDialog (value) {
  emits('update:model-value', value)
}
const getColorByState = state => (state) ? 'green' : '#525252'

const state = reactive({
  pump: 0,
  heater: 1,
  v220: 0,
  pwrMeasure: 0
})

</script>

<style lang="scss" scoped>
.card{
  background-color: black;
}
</style>
