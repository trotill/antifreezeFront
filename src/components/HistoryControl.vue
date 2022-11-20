<template>
  <group-container :x-size="width" board-color="#1d1d1d" :y-size="height">
    <div class="controlMain">
      <div>
        <date-filter v-model:filter-date="filterDate"/>

      </div>
      <div class="rangeGroupMain">
        <sensor-range label="U(V)" :min="0" :max="300" :step="10" v-model="range.voltage" />
        <sensor-range label="I(A)" :min="0" :max="10" :step="0.1" v-model="range.current" />
        <sensor-range label="P(W)" :min="0" :max="2000" :step="50" v-model="range.power" />
        <sensor-range label="t(°C)" :min="-30" :max="40" :step="1" v-model="range.temp" />
        <sensor-range label="H(%)" :min="0" :max="100" :step="5" v-model="range.humidity" />
      </div>
      <div class="resetAverageMain">
        <q-btn style="height: 40px" outline color="primary" label="Reset" @click="setToDefault" />
        <q-select outlined dense class="averageMain q-pl-sm" dark standout v-model="srcAverType" :options="averOptions" label="Step" />
        <q-btn style="height: 40px; margin-left: 10px"  outline color="primary" label="" icon="check" @click="find"/>
      </div>
    </div>
  </group-container>
</template>

<script setup>

import { ref } from 'vue'
import SensorRange from './SensorRange.vue'
import GroupContainer from './GroupContainer.vue'
import DateFilter from './DateFilter.vue'
import { rangeDefault } from 'src/api/const'
const props = defineProps({
  setFilter: {
    type: Function
  },
  reset: {
    type: Function
  }
})
const averOptions = [
  {
    label: 'One sec',
    value: 'none'
  },
  {
    label: 'Ten sec',
    value: 'avgSec10'
  },
  {
    label: 'Min',
    value: 'avgMin'
  },
  {
    label: 'Hour',
    value: 'avgHour'
  },
  {
    label: 'Day',
    value: 'avgDay'
  }
]

const range = ref({ ...rangeDefault })
const srcAverType = ref({
  label: 'One sec',
  value: 'none'
})
const filterDate = ref(null)
const width = 4
const height = 4

function setToDefault () {
  range.value = { ...rangeDefault }
  filterDate.value = null
  srcAverType.value = averOptions[0]
  props.reset()
  find()
}

function find () {
  const filter = {
    date: filterDate.value,
    average: srcAverType.value,
    sensorRange: range.value
  }
  props.setFilter(filter)
}

</script>

<style scoped>
.averageMain{
  width: 180px;
}
.rangeGroupMain{
  display: flex;
  justify-content: space-between;
}

.controlMain{
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
}
.resetAverageMain{
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
}
</style>
