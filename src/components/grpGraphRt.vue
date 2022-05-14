<template>
  <group-container board-color='black' :x-size="graphWidth" :y-size="graphHeight">
    <div class="graphRtMain">
    <LineChart :chartData="chartData" :options="options" :width="graphWidth*containerStep" :height="graphHeight*containerStep"/>
    </div>
  </group-container>
</template>

<script setup>
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { groupContainerStep } from '../api/const.js'
import rest from '../api/http/route.js'
import GroupContainer from '../components/GroupContainer.vue'
import { onMounted, reactive } from 'vue'
import { errorToast } from '../api/toast'

const prop = defineProps({
  bigSize: {
    type: Boolean,
    default: false
  }
})

const containerStep = groupContainerStep
const graphWidth = (prop.bigSize) ? 12 : 4
const graphHeight = (prop.bigSize) ? 4 : 3
Chart.register(...registerables)
const options = {
  plugins: {
    title: {
      text: 'Realtime sensor data',
      display: true
    }
  },
  scales: {
    x: {
      type: 'time',
      ticks: {
        color: '#3dcef1'
      },
      grid: {
        display: true,
        color: '#034104'
      }
    },
    y: {
      grid: {
        color: '#034104'
      },
      ticks: {
        color: '#3dcef1'
      },
      title: {
        display: true,
        text: 'value'
      }
    }
  }
}

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

function rawToXY (sensor, ts) {
  return sensor.map((v, idx) => ({ x: ts[idx], y: v }))
}
onMounted(async () => {
  const sensorData = await rest.getSensorList({
    where: {
      ts: {
        $lte: Date.now() - (86400 * 1000)
      },
      avgMin: {
        $ne: null
      }
    },
    fieldList: ['voltage', 'ts', 'power', 'current', 'temp', 'humidity'],
    group: ['avgMin']
  })
  if (!sensorData?.meta) {
    errorToast('Error read sensor data')
  } else {
    console.log('sensorData', sensorData)
    const { voltage, ts, power, current, temp, humidity } = sensorData.data
    chartData.datasets[0].data = rawToXY(voltage, ts)
    chartData.datasets[1].data = rawToXY(power, ts)
    chartData.datasets[2].data = rawToXY(current, ts)
    chartData.datasets[3].data = rawToXY(temp, ts)
    chartData.datasets[4].data = rawToXY(humidity, ts)
  }
})
</script>

<style scoped>
.graphRtMain{

  margin: 10px;
}
</style>
