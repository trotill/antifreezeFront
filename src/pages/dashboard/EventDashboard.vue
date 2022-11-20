<template>
  <div class="dashboardTabMain">
    <Event-table :big-size="!store.isMobile"/>
  </div>
</template>

<script setup>

import EventTable from 'src/components/EventTable.vue'
import { useAfStore } from 'stores/antifreeze'

const store = useAfStore()
</script>

<style scoped>

</style>
