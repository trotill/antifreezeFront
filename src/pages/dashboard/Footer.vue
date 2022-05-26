<template>
  <div class="dashboardTabMain">
    <grp-pump-realtime :pump-current="af.pumpCurrent" :pump-voltage="af.pumpVoltage" :pump-power="af.pumpPower"  />
    <div class="flexColumn">
      <div class="flexRow">
        <div class="flexColumn">
          <grp-pump-heater-status :heater-relay="af.heaterRelay"
                                  :pump-relay="af.pumpRelay"
                                  :pump-state="af.pumpState"
                                  :heater-state="af.heaterState"
                                  :change-heat="toDeviceAf('heater')"
                                  :change-pump="toDeviceAf('pump')"  />
          <grp-mode-algo :algo="af.algo"
                         :mode="af.mode"
                         :change-mode="toDeviceAf('mode')"/>
        </div>
        <div class="flexColumn">
          <div class="flexRow">
            <grp-temp :temperature="af.temperature"/>
            <grp-humidify :humidity="af.humidity"/>
          </div>
          <grp-last-trig :text="af.statInfo"/>
        </div>
      </div>
      <grp-relay-state :state="af.state"/>
    </div>
    <div class="flexColumn">
      <div class="flexRow">
        <grp-wd-mode :bath="fd.relayBath" :mode="fd.footerMode"
                     :change-mode="toDeviceWd('footerMode')"
                     :change-bath-pwr="toDeviceWd('relayBath')"/>
        <grp-wd-reset :reset12-v="toDeviceWd('doRebootDev')" :self-reset="toDeviceWd('reboot')"/>
      </div>
      <div class="flexRow">
        <grp-string-info label="Reboot 12V line over" :value="fd.countdown"/>
        <grp-string-info label="Reboot 12V line total" :value="fd.devRebootCntr"/>
      </div>
      <group-container :x-size="4" :y-size="1">
        <div class="lastPacketMain">
          <div :style="{color:(deadDevice.af)?'red':'#d9d9d9'}">AF {{af.packTime}}</div>
          <div :style="{color:(deadDevice.fd)?'red':'#d9d9d9'}" >WD {{fd.packTime}}</div>
        </div>
      </group-container>

    </div>
    <grp-graph-rt :big-size="!store.state.isMobile"/>
  </div>
</template>

<script setup>

import GrpPumpRealtime from '../../components/GrpPumpRealtime.vue'
import GrpPumpHeaterStatus from '../../components/GrpPumpHeaterStatus.vue'
import GrpModeAlgo from '../../components/GrpModeAlgo.vue'
import GrpTemp from '../../components/GrpTemp.vue'
import GrpHumidify from '../../components/GrpHumidify.vue'
import GrpRelayState from '../../components/GrpRelayState.vue'
import GrpLastTrig from '../../components/GrpLastTrig.vue'
import Rest from '../../api/http/route.js'
import { errorToast } from '../../api/toast.js'
import GrpWdMode from '../../components/GrpWdMode.vue'
import GrpWdReset from '../../components/GrpWdReset.vue'
import GrpStringInfo from '../../components/GrpStringInfo.vue'
import GroupContainer from '../../components/GroupContainer.vue'
import GrpGraphRt from '../../components/GrpChartRt.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

function toDeviceFabric (device) {
  return function (param) {
    return async function (state) {
      const paramObj = [...param.split('.'), state].reverse().reduce((old, src) => ({ [src]: old }))
      const result = await Rest.setDevData(paramObj, device)
      if (!result?.meta) {
        errorToast(`Error send data ${param}:${state}`)
      }
    }
  }
}

const toDeviceAf = toDeviceFabric('antifreeze')
const toDeviceWd = toDeviceFabric('footerDog')
const lastTime = {
  af: 0,
  fd: 0
}
const deadDevice = ref({
  af: true,
  fd: true
})
setInterval(() => {
  deadDevice.value.af = (lastTime.af >= 5)
  deadDevice.value.fd = (lastTime.fd >= 5)
  lastTime.af++
  lastTime.fd++
}, 1000)
const af = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  lastTime.af = 0
  return {
    packTime: new Date().toLocaleString(),
    pumpVoltage: { min: 180, max: store.state.antifreezeState.ac0.voltage },
    pumpPower: { min: 0, max: store.state.antifreezeState.ac0.power },
    pumpCurrent: { min: 0, max: store.state.antifreezeState.ac0.current },
    pumpState: store.state.antifreezeState.pumpWork,
    pumpRelay: store.state.antifreezeState.relay.pump,
    heaterState: store.state.antifreezeState.relay.heater,
    heaterRelay: store.state.antifreezeState.relay.heater,
    algo: store.state.antifreezeState.autoMode.state,
    mode: store.state.antifreezeState.autoMode.mode,
    temperature: store.state.antifreezeState.md02Main.temp,
    humidity: store.state.antifreezeState.md02Main.humi,
    statInfo: store.state.antifreezeState.message.replaceAll('] ', ']\n'),
    state: {
      pump: store.state.antifreezeState.device.relayPumpAvail,
      heater: store.state.antifreezeState.device.relayHeaterAvail,
      v220: !store.state.antifreezeState.powerLoss,
      pwrMeasure: store.state.antifreezeState.device.acAvail
    }

  }
})

const fd = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  lastTime.fd = 0
  return {
    packTime: new Date().toLocaleString(),
    relayBath: store.state.footerDogState.relay.relayBath,
    footerMode: store.state.footerDogState.footerMode,
    countdown: store.state.footerDogState.countdown,
    devRebootCntr: store.state.footerDogState.devRebootCntr
  }
})

</script>

<style scoped>
.flexRow{
  display: flex;
  flex-direction: row
}
.lastPacketMain{
  font-size: 20px;
  color: #d9d9d9;
}
.flexColumn{
  display: flex;
  flex-direction: column;
}

:deep(.marker-labels-class){
  color: #b5b5b5;
  user-select: none;
}
</style>
