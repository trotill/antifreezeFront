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
    <grp-graph-rt :big-size="!store.isMobile"/>
  </div>
</template>

<script setup>

import GrpPumpRealtime from 'src/components/GrpPumpRealtime.vue'
import GrpPumpHeaterStatus from 'src/components/GrpPumpHeaterStatus.vue'
import GrpModeAlgo from 'src/components/GrpModeAlgo.vue'
import GrpTemp from 'src/components/GrpTemp.vue'
import GrpHumidify from 'src/components/GrpHumidify.vue'
import GrpRelayState from 'src/components/GrpRelayState.vue'
import GrpLastTrig from 'src/components/GrpLastTrig.vue'
import Rest from 'src/api/http/route'
import { errorToast } from 'src/api/toast'
import GrpWdMode from 'src/components/GrpWdMode.vue'
import GrpWdReset from 'src/components/GrpWdReset.vue'
import GrpStringInfo from 'src/components/GrpStringInfo.vue'
import GroupContainer from 'src/components/GroupContainer.vue'
import GrpGraphRt from 'src/components/GrpChartRt.vue'
import { computed, ref } from 'vue'
import { useAfStore } from 'stores/antifreeze'
import { errorHandler } from 'src/api/util'

const store = useAfStore()

function toDeviceFabric (device) {
  return function (param) {
    return async function (state) {
      const paramObj = [...param.split('.'), state].reverse().reduce((old, src) => ({ [src]: old }))
      const result = await Rest.setDevData(paramObj, device)
      errorHandler({ result, param, state })
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
  return {
    packTime: new Date().toLocaleString(),
    pumpVoltage: { min: 180, max: store.antifreezeState.ac0.voltage },
    pumpPower: { min: 0, max: store.antifreezeState.ac0.power },
    pumpCurrent: { min: 0, max: store.antifreezeState.ac0.current },
    pumpState: store.antifreezeState.pumpWork,
    pumpRelay: store.antifreezeState.relay.pump,
    heaterState: store.antifreezeState.relay.heater,
    heaterRelay: store.antifreezeState.relay.heater,
    algo: store.antifreezeState.autoMode.state,
    mode: store.antifreezeState.autoMode.mode,
    temperature: store.antifreezeState.md02Main.temp,
    humidity: store.antifreezeState.md02Main.humi,
    statInfo: store.antifreezeState.message.replaceAll('] ', ']\n'),
    state: {
      pump: store.antifreezeState.device.relayPumpAvail,
      heater: store.antifreezeState.device.relayHeaterAvail,
      v220: !store.antifreezeState.powerLoss,
      pwrMeasure: store.antifreezeState.device.acAvail
    }

  }
})

const fd = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  lastTime.fd = 0
  return {
    packTime: new Date().toLocaleString(),
    relayBath: store.footerDogState.relay.relayBath,
    footerMode: store.footerDogState.footerMode,
    countdown: store.footerDogState.countdown,
    devRebootCntr: store.footerDogState.devRebootCntr
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
