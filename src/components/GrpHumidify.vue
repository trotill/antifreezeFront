<template>
  <group-container :x-size="1" :y-size="1" label="Humid %" >
      <q-knob
        show-value
        font-size="18px"
        :model-value="humidity"
        size="60px"
        :thickness="0.22"
        :color="(humidity>80)?'red':'blue'"
        :min="0"
        :max="100"
        readonly
        track-color="grey-3"
        class="q-ma-md tempKnob"
      >
        {{ humidity }}
      </q-knob>
  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'
defineProps({
  humidity: Number
})

</script>

<style scoped>
.tempKnob{
  color: #eaeaea!important;
  margin: 0!important;
}
</style>
