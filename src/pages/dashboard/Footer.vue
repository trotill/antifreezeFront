<template>
  <div class="antifreeze-main">
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
        <grp-wd-mode :bath="wd.relayBath" :mode="wd.footerMode"
                     :change-mode="toDeviceWd('footerMode')"
                     :change-bath-pwr="toDeviceWd('relayBath')"/>
        <grp-wd-reset :reset12-v="toDeviceWd('doRebootDev')" :self-reset="toDeviceWd('reboot')"/>
      </div>
      <div class="flexRow">
        <grp-string-info label="Reboot 12V line over" :value="wd.countdown"/>
        <grp-string-info label="Reboot 12V line total" :value="wd.devRebootCntr"/>
      </div>
      <group-container :x-size="4" :y-size="1" empty/>

    </div>
    <grp-graph-rt :big-size="!store.state.isMobile"/>
  </div>
</template>

<script setup>

import GrpPumpRealtime from '../../components/grpPumpRealtime.vue'
import GrpPumpHeaterStatus from '../../components/grpPumpHeaterStatus.vue'
import GrpModeAlgo from '../../components/grpModeAlgo.vue'
import GrpTemp from '../../components/grpTemp.vue'
import GrpHumidify from '../../components/grpHumidify.vue'
import GrpRelayState from '../../components/grpRelayState.vue'
import GrpLastTrig from '../../components/grpLastTrig.vue'
import Rest from '../../api/http/route.js'
import { errorToast } from '../../api/toast.js'
import GrpWdMode from '../../components/grpWdMode.vue'
import GrpWdReset from '../../components/grpWdReset.vue'
import GrpStringInfo from '../../components/grpStringInfo.vue'
import GroupContainer from '../../components/GroupContainer.vue'
import GrpGraphRt from '../../components/grpGraphRt.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

function toDeviceFabric (device) {
  return function (param) {
    return async function (state) {
      console.log('state', state)

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

const af = computed(() => {
  return {
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

const wd = computed(() => {
  return {
    relayBath: store.state.footerDogState.relay.relayBath,
    footerMode: store.state.footerDogState.footerMode,
    countdown: store.state.footerDogState.countdown,
    devRebootCntr: store.state.footerDogState.devRebootCntr
  }
})

</script>

<style scoped>
.antifreeze-main{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;

}

.flexRow{
  display: flex;
  flex-direction: row
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
