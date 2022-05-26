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
import GroupContainer from '../components/GroupContainer.vue'
import zoomPlugin from 'chartjs-plugin-zoom'
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const props = defineProps({
  bigSize: {
    type: Boolean,
    default: false
  },
  maxWidth: Boolean,
  chartData: Object,
  label: String
})

const containerStep = groupContainerStep
const graphWidth = computed(() => {
  return (props.bigSize) ? 12 : (props.maxWidth) ? Math.trunc(store.state.windowWidth / groupContainerStep) : 4
})

const graphHeight = (props.bigSize) ? 4 : 3
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
      text: props.label,
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
      time: {
        displayFormats: {
          year: 'YYYY:MM:DD',
          quarter: 'YYYY:MM:DD',
          month: 'YYYY:MM:DD',
          week: 'MM:DD-HH.mm',
          day: 'MM:DD-HH.mm',
          hour: 'DD-HH.mm.ss',
          minute: 'DD-HH.mm.ss',
          second: 'DD-HH.mm.ss'
        }
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

</script>

<style scoped>
.graphRtMain{
  margin: 10px;
}
</style>
