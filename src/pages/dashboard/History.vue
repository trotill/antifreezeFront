<template>
  <div class="dashboardTabMain">
    <div class="controlTableMain">
      <History-control :set-filter="setFilter" :reset="resetFilter"/>
      <History-table :big-size="!store.state.isMobile" :rows="tableData" :loading="loading"/>
    </div>
    <sensor-chart :big-size="!store.state.isMobile" maxWidth :chart-data="chartData" label="Sensor data"/>
    <q-page-sticky v-if="tableData.length>0" position="bottom-right" :offset="[5, 5]">
      <q-btn  icon="keyboard_arrow_right"  class="naviButtonMain" color="primary" @click="clickRight"/>
    </q-page-sticky>
    <q-page-sticky v-if="offset!==0" position="bottom-left" :offset="[5, 5]">
      <q-btn  icon="keyboard_arrow_left" class="naviButtonMain" color="primary"  @click="clickLeft" />
    </q-page-sticky>
  </div>
</template>

<script setup>

import HistoryControl from '../../components/HistoryControl.vue'
import HistoryTable from '../../components/HistoryTable.vue'
import SensorChart from '../../components/SensorChart.vue'
import rest from '../../api/http/route.js'
import { errorToast } from '../../api/toast.js'
import { rawToXY } from '../../api/util.js'
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'

import { rangeDefault } from '../../api/const.js'
const store = useStore()
const props = defineProps({
  limit: {
    type: Number,
    default: 300
  }
})

const loading = ref(false)
const offset = ref(0)
const filter = ref({
  date: null,
  sensorRange: { ...rangeDefault },
  average: {
    label: 'None',
    value: 'none'
  }
})
function clickRight () {
  offset.value += props.limit
  sensorDataRequest()
}
function clickLeft () {
  if ((offset.value - props.limit) >= 0) { offset.value -= props.limit }
  sensorDataRequest()
}
function setFilter (newFilter) {
  filter.value = newFilter
  offset.value = 0
  sensorDataRequest()
}
function resetFilter () {
  offset.value = 0
}
const tableData = ref([])
const chartData = reactive({
  datasets: [{
    data: [],
    backgroundColor: 'black',
    borderColor: '#df75ff',
    cubicInterpolationMode: 'monotone',
    label: 'voltage'
  },
  {
    data: [],
    backgroundColor: 'black',
    borderColor: '#7aff63',
    cubicInterpolationMode: 'monotone',
    label: 'power'
  },
  {
    data: [],
    backgroundColor: 'black',
    borderColor: '#d2d2d2',
    cubicInterpolationMode: 'monotone',
    label: 'current'
  },
  {
    data: [],
    backgroundColor: 'black',
    borderColor: '#af0000',
    cubicInterpolationMode: 'monotone',
    label: 'temp'
  },
  {
    data: [],
    backgroundColor: 'black',
    borderColor: '#faef00',
    cubicInterpolationMode: 'monotone',
    label: 'humidity'
  }
  ]
})

function buildSensorParamWhere (name, value, where) {
  where[name] = {
    $gte: value.min,
    $lte: value.max
  }
}
async function sensorDataRequest () {
  loading.value = true
  const where = {}
  if (filter.value.date) {
    const from = filter.value.date?.from ?? new Date(filter.value.date).getTime()
    const to = filter.value.date?.to ?? new Date(filter.value.date).getTime() + 86400000
    where.ts = {
      $gte: +new Date(from),
      $lte: +new Date(to)
    }
  }
  Object.entries(filter.value.sensorRange).forEach(([name, value]) => {
    buildSensorParamWhere(name, value, where)
  })
  const group = (filter.value.average.value === 'none') ? [] : [filter.value.average.value]

  const sensorData = await rest.getSensorList({
    where,
    fieldList: ['voltage', 'ts', 'power', 'current', 'temp', 'humidity'],
    group,
    offset: offset.value,
    limit: props.limit
  })
  if (!sensorData?.meta) {
    errorToast('Error read sensor data')
  } else {
    const isFound = !!Object.keys(sensorData.data).length;
    ['voltage', 'power', 'current', 'temp', 'humidity'].forEach((name, idx) => {
      chartData.datasets[idx].data = (isFound) ? rawToXY(sensorData.data[name], sensorData.data.ts) : []
      tableData.value.push({})
    })
    if (isFound) {
      tableData.value = sensorData.data.ts.map((ts, idx) => {
        const data = {
          time: new Date(ts).toLocaleString()
        };
        ['voltage', 'power', 'current', 'temp', 'humidity'].forEach((name) => {
          data[name] = sensorData.data[name][idx]
        })
        return data
      })
    } else {
      tableData.value = []
    }
  }
  loading.value = false
}

onMounted(async () => {
  await sensorDataRequest()
})
</script>

<style scoped>

.controlTableMain{
  display:flex;
  flex-wrap: wrap;
  justify-content: center;
}
.naviButtonMain{
  width:100px
}
</style>
