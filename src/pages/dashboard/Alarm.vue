<template>
  <div class="alarm-main">
    <event-table :big-size="!store.state.isMobile"/>
  </div>
</template>

<script setup>

import EventTable from '../../components/eventTable.vue'

import { useStore } from 'vuex'
const store = useStore()
</script>

<style scoped>
.alarm-main{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 100%;
}

</style>
