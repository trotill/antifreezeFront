<template>
  <div class="mainSettingBlock">
    <div class="mainGrid">
      <group-container :x-size="4" :y-size="5" label="Antifreeze device">
        <div class="settingList">
        <Input :readonly="true" label="IP" :modelValue="antifreeze.ip"/>
          <Input :readonly="true" label="WiFi RSSI" :modelValue="antifreeze.wifiRssi"/>
          <Input :readonly="true" label="WiFi Channel" :modelValue="antifreeze.wifiCh"/>
        <Input :readonly="true" label="Reboot cnt" :modelValue="antifreeze.rebootCounter"/>
          <Input :readonly="true" label="SW version" :modelValue="antifreeze.version"/>
          <Input :readonly="true" label="Free mem" :modelValue="antifreeze.freeMem"/>
          <Input label="Heat time" :modelValue="antifreeze.heaterWorkTime"
                 :changed="heaterWorkTimeChanged"
                 @update:modelValue="heaterWorkTimeInput = $event"/>
          <Input label="Pump time" :modelValue="antifreeze.pumpWorkTime"
                 :changed="pumpWorkTimeChanged"
                 @update:modelValue="pumpWorkTimeInput = $event"/>

        </div>
      </group-container>

      <group-container :x-size="4" :y-size="5" label="FooterDog device">
        <div class="settingList">
          <Input :readonly="true" label="IP" :modelValue="footerDog.ip"/>
          <Input :readonly="true" label="WiFi RSSI" :modelValue="footerDog.wifiRssi"/>
          <Input :readonly="true" label="WiFi Channel" :modelValue="footerDog.wifiCh"/>

          <Input :readonly="true" label="Reboot cnt" :modelValue="footerDog.rebootCounter"/>
          <Input :readonly="true" label="SW version" :modelValue="footerDog.version"/>
          <Input :readonly="true" label="Free mem" :modelValue="footerDog.freeMem"/>
          <Input label="Time wait AF" :modelValue="footerDog.waitDevTimeout"
                 :changed="waitDevTimeoutChanged"
                 @update:modelValue="waitDevTimeoutInput = $event"/>

          <Input label="Reboot AF cnt" :modelValue="footerDog.selfRebootCntr"
                 :changed="rebootAfChanged"
                 @update:modelValue="rebootAfInput = $event"/>

        </div>
      </group-container>
    </div>

    <q-btn class="sendButton controlButtonSize" color="blue-5" label="Send changed data" @click="sendClick" />

  </div>
</template>

<script setup>
import GroupContainer from '../components/GroupContainer.vue'
import Input from '../components/Input.vue'
import { reactive, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Rest from '../api/http/route'
import { errorToast } from '../api/toast'

const store = useStore()

const rebootAfInput = ref(0)
const rebootAfChanged = computed(() => footerDog.value.selfRebootCntr !== +rebootAfInput.value)

const waitDevTimeoutInput = ref(0)
const waitDevTimeoutChanged = computed(() => footerDog.value.waitDevTimeout !== +waitDevTimeoutInput.value)

const heaterWorkTimeInput = ref(0)
const heaterWorkTimeChanged = computed(() => antifreeze.value.heaterWorkTime !== +heaterWorkTimeInput.value)

const pumpWorkTimeInput = ref(0)
const pumpWorkTimeChanged = computed(() => antifreeze.value.pumpWorkTime !== +pumpWorkTimeInput.value)

async function sendData (device, param, data) {
  const result = await Rest.setDevData({
    [param]: +data
  }, device)
  if (!result?.meta) {
    errorToast(`Error send data ${param}:${data}`)
  }
}
async function sendClick () {
  (rebootAfChanged.value) && await sendData('footerDog', 'selfRebootCntr', rebootAfInput.value);
  (waitDevTimeoutChanged.value) && await sendData('footerDog', 'waitDevTimeout', waitDevTimeoutInput.value);
  (heaterWorkTimeChanged.value) && await sendData('antifreeze', 'heaterWorkTime', heaterWorkTimeInput.value);
  (pumpWorkTimeChanged.value) && await sendData('antifreeze', 'pumpWorkTime', pumpWorkTimeInput.value)
}

const antifreeze = computed(() => {
  const state = store.state.antifreezeState
  return {
    wifiRssi: state.wifi.rssi,
    wifiCh: state.wifi.ch,
    ip: state.ip,
    freeMem: state.freeMem,
    version: state.v,
    rebootCounter: state.rebootCntr,
    heaterWorkTime: state.device.heaterWorkTime,
    pumpWorkTime: state.device.pumpWorkTime
  }
})
const footerDog = computed(() => {
  const state = store.state.footerDogState
  return {
    wifiRssi: state.wifi.rssi,
    wifiCh: state.wifi.ch,
    ip: state.ip,
    freeMem: state.freeMem,
    version: state.v,
    rebootCounter: state.rebootCntr,
    waitDevTimeout: state.waitDevTimeout,
    selfRebootCntr: state.selfRebootCntr
  }
})
onMounted(() => {
  rebootAfInput.value = footerDog.value.selfRebootCntr
  waitDevTimeoutInput.value = footerDog.value.waitDevTimeout
  heaterWorkTimeInput.value = antifreeze.value.heaterWorkTime
  pumpWorkTimeInput.value = antifreeze.value.pumpWorkTime
})
/* const antifreeze = reactive({
  ip: '0.0.0.0',
  reboot: 0,
  SWversion: 'Fri Mar 25 00:23:21 2022',
  freeMem: 100000,
  wifiRssi: -74,
  wifiCh: 1
}) */

</script>

<style scoped>
.sendButton{
  margin: 20px;
}
.settingList{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: space-around;
  height: 100%;
}
.mainGrid{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
}
</style>
