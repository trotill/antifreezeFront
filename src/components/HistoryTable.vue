<template>
  <group-container board-color='black' :x-size="tableWidth" :y-size="tableHeight">
  <div class="tableContainer">
    <q-table
      style="height: 100%"
      title="Sensor data"
      :rows="rows"
      dense
      dark
      :loading="loading"
      :pagination="pagination"
      :columns="columns"
      row-key="time"
    >
    </q-table>
  </div>
  </group-container>
</template>

<script setup>
import GroupContainer from './GroupContainer.vue'
const props = defineProps({
  bigSize: Boolean,
  rows: Object,
  loading: Boolean
})
const pagination = {
  rowsPerPage: 0
}
const tableWidth = (props.bigSize) ? 8 : 4
const tableHeight = 4
const columns = [
  { field: 'time', name: 'time', align: 'center', label: 'Date/Time', sortable: true },
  { field: 'voltage', name: 'voltage', align: 'left', label: 'U(V)', sortable: true },
  { field: 'current', name: 'current', align: 'left', label: 'I(A)', sortable: true },
  { field: 'power', name: 'power', align: 'left', label: 'P(W)', sortable: true },
  { field: 'temp', name: 'temp', align: 'left', label: 't(C)', sortable: true },
  { field: 'humidity', name: 'humidity', align: 'left', label: 'H(%)', sortable: true }
]
</script>

<style scoped>
.tableContainer{
  width:100%;
  height:100%;
}
</style>
