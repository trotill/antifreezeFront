<template>
  <div >
    <q-tabs
      dense
      class="dashboard-tab-main"
    >
      <q-route-tab name="antifreeze" icon="extension" label="Antifreeze" to="/dashboard/antifreeze" exact/>
      <q-route-tab name="alarms" icon="circle_notifications" label="Alarms" to="/dashboard/alarm" exact>
        <q-badge color="red" floating>0</q-badge>
      </q-route-tab>
      <q-route-tab name="history" icon="timeline" label="History" to="/dashboard/history"/>
    </q-tabs>
    <router-view name="dashboard" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {

})
</script>

<style scoped>
.dashboard-tab-main{
  background-color: #23555b;
  color: white;
}
</style>
