<template>
  <group-container :x-size="2" :y-size="1" label="Pump/heater status">
    <label-container label="Pump on/off" >
      <q-btn dense class="buttonDashboard" :color="(pumpState)?'green':'grey'" glossy unelevated  :text-color="(pumpRelay)?'white':'red'" icon="water_drop"
             label="" @click="changePump(+!pumpRelay)">
        <div class="buttonLabel">Pump</div></q-btn>

    </label-container>
    <label-container label="Heater on/off" >
      <q-btn dense class="buttonDashboard" :color="(heaterState)?'green':'grey'" glossy unelevated  :text-color="(!heaterRelay)?'white':'red'" icon="cable"
             label="" @click="changeHeat(+!heaterRelay)">
        <div class="buttonLabel">Heat</div></q-btn>
    </label-container>

  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'
import LabelContainer from './LabelContainer.vue'

defineProps({
  changePump: Function,
  changeHeat: Function,
  heaterRelay: Number,
  pumpRelay: Number,
  pumpState: Number,
  heaterState: Number

})

</script>

<style lang="scss" scoped>
@import "src/css/main";
.buttonLabel{
  color: white;
}
</style>
