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
          <Input label="Heat time" :modelValue="antifreeze.heaterWorkTime"/>
          <Input label="Pump time" :modelValue="antifreeze.pumpWorkTime"/>

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
          <Input label="Time wait AF" :modelValue="footerDog.waitDevTimeout"/>
          <Input label="Reboot AF cnt" :modelValue="footerDog.selfRebootCntr" v-model:changed="rebootAFcnt.changed"/>

        </div>
      </group-container>
    </div>

    <q-btn class="sendButton controlButtonSize" color="blue-5" label="Send changed data" />

  </div>
</template>

<script setup>
import GroupContainer from '../components/GroupContainer.vue'
import Input from '../components/Input.vue'
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
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

/* const antifreeze = reactive({
  ip: '0.0.0.0',
  reboot: 0,
  SWversion: 'Fri Mar 25 00:23:21 2022',
  freeMem: 100000,
  wifiRssi: -74,
  wifiCh: 1
}) */

const rebootAFcnt = reactive({
  value: 0,
  changed: false
})

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
