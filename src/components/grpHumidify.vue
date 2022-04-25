<template>
  <group-container :x-size="1" :y-size="1" label="Humidity" >
      <q-knob
        show-value
        font-size="18px"
        v-model="humidity"
        size="60px"
        :thickness="0.22"
        :color="(humidity>80)?'red':'blue'"
        min="0"
        max="100"
        readonly
        track-color="grey-3"
        class="q-ma-md tempKnob"
      >
        {{ humidity }}%
      </q-knob>
  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const humidity = computed(() => {
  return store.state.antifreezeState.md02Main.humi
})

</script>

<style scoped>
.tempKnob{
  color: #eaeaea!important;
  margin: 0px!important;
}
</style>
