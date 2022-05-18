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
import zoomPlugin from 'chartjs-plugin-zoom'

const prop = defineProps({
  bigSize: {
    type: Boolean,
    default: false
  }
})

/* const rtDataLocal = reactive({
  voltage: 0,
  power: 0,
  current: 0,
  temp: 0,
  humidity: 0
}) */

const containerStep = groupContainerStep
const graphWidth = (prop.bigSize) ? 12 : 4
const graphHeight = (prop.bigSize) ? 4 : 3
Chart.register(...registerables)
Chart.register(zoomPlugin)
const options = {
  maintainAspectRatio: false,
  responsive: true,
  animation: {
    duration: 0
  },
  plugins: {
    title: {
      text: 'Realtime sensor data (last day preload)',
      display: true
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x'
      },
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'x'
      }
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
  })
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
.graphRtMain{

  margin: 10px;
}
</style>
