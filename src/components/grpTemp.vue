<template>
  <group-container :x-size="1" :y-size="1" label="Temp" >

      <q-knob
        show-value
        font-size="18px"
        v-model="temperature"
        size="60px"
        :thickness="0.22"
        :color="(temperature>0)?'red':'blue'"
        min="-30"
        max="30"
        readonly
        track-color="grey-3"
        class="q-ma-md tempKnob"
      >
        {{ temperature }}°C
      </q-knob>

  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const temperature = computed(() => {
  return store.state.antifreezeState.md02Main.temp
})

</script>

<style scoped>
.tempKnob{
  color: #eaeaea!important;
  margin: 0px!important;
}
</style>
