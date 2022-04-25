<template>
  <div class="antifreeze-main">
    <grp-pump-realtime  />
    <div class="flexColumn">
      <div class="flexRow">
        <div class="flexColumn">
          <grp-pump-heater-status  />
          <grp-mode-algo/>
        </div>
        <div class="flexColumn">
          <div class="flexRow">
            <grp-temp/>
            <grp-humidify/>
          </div>
          <grp-last-trig/>
        </div>
      </div>
      <grp-relay-state/>
    </div>

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
import AfControl from '../../components/afControl.vue'

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
