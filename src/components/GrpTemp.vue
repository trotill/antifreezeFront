<template>
  <group-container :x-size="1" :y-size="1" label="Temp °C" >

      <q-knob
        show-value
        font-size="18px"
        :model-value="temperature"
        size="60px"
        :thickness="0.22"
        :color="(temperature>0)?'red':'blue'"
        :min="-30"
        :max="30"
        readonly
        track-color="grey-3"
        class="q-ma-md tempKnob"
      >
        {{ temperature }}
      </q-knob>

  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'

defineProps({
  temperature: Number
})

</script>

<style scoped>
.tempKnob{
  color: #eaeaea!important;
  margin: 0!important;
}
</style>
