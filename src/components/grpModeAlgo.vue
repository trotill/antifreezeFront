<template>
  <group-container :x-size="2" :y-size="1" label="Work mode/algo">
    <label-container label="Mode A/M" >
      <q-btn class="buttonDashboard" dense :color="(mode!=='auto')?'grey':'green'"  glossy unelevated  text-color="white" icon="back_hand" :label="mode"/>
    </label-container>
    <label-container label="Algo stage">
      <q-btn class="buttonDashboard" dense :color="(algo!=='auto')?'primary':'green'" text-color="white" icon="psychology" :label="'ST '+algo"/>
    </label-container>
  </group-container>
</template>

<script setup>

import GroupContainer from './GroupContainer.vue'
import LabelContainer from './LabelContainer.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const algo = computed(() => {
  return store.state.antifreezeState.autoMode.state
})
const mode = computed(() => {
  return (store.state.antifreezeState.autoMode.mode === 0) ? 'auto' : 'manual'
})

</script>

<style lang="scss" scoped>
@import "src/assets/main.scss";
</style>
