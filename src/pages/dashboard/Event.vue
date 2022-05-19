<template>
  <div class="dashboardTabMain">
    <Event-table :big-size="!store.state.isMobile"/>
  </div>
</template>

<script setup>

import EventTable from '../../components/EventTable.vue'

import { useStore } from 'vuex'
const store = useStore()
</script>

<style scoped>

</style>
