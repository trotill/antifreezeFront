<template>
  <sensor-chart :big-size="bigSize" :chart-data="chartData" label="Realtime sensor data (last day preload)"/>
</template>

<script setup>
import rest from '../api/http/route.js'
import { onMounted, reactive } from 'vue'
import { errorToast } from '../api/toast'
import { rawToXY } from '../api/util.js'
import SensorChart from './SensorChart.vue'

defineProps({
  bigSize: {
    type: Boolean,
    default: false
  }
})

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

async function sensorDataRequest ({ sec = 60, concat = true } = {}) {
  const sensorData = await rest.getSensorList({
    where: {
      ts: {
        $gte: Date.now() - (sec * 1000)
      },
      avgMin: {
        $ne: null
      }
    },
    fieldList: ['voltage', 'ts', 'power', 'current', 'temp', 'humidity'],
    group: ['avgMin']
  }, false)
  if (!sensorData?.meta) {
    errorToast('Error read sensor data')
  } else {
    ['voltage', 'power', 'current', 'temp', 'humidity'].forEach((name, idx) => {
      if (concat) {
        if (sensorData.data[name].length > 0) {
          const sensorDataOldestItem = { y: sensorData.data[name][0], x: sensorData.data.ts[0] }
          chartData.datasets[idx].data.push(sensorDataOldestItem)
        }
      } else {
        chartData.datasets[idx].data = rawToXY(sensorData.data[name], sensorData.data.ts)
      }
    })
  }
}
setInterval(async () => {
  chartData.datasets.forEach(({ data }) => data.shift())
  await sensorDataRequest()
}, 60000)
onMounted(async () => {
  await sensorDataRequest({ sec: 86400, concat: false })
})
</script>

<style scoped>

</style>
