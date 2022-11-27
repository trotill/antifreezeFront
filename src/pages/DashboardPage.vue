<template>
  <div >
    <q-tabs dense class="dashboard-tab-main">
      <q-route-tab name="footer" icon="extension" label="footer" to="/dashboard/footer" exact/>
      <q-route-tab name="events" icon="circle_notifications" label="Events" to="/dashboard/event" exact>
        <q-badge color="red" floating>{{unreadEvent}}</q-badge>
      </q-route-tab>
      <q-route-tab name="history" icon="timeline" label="History" to="/dashboard/history"/>
    </q-tabs>
    <router-view name="dashboard" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import rest from 'src/api/http/route'
import { errorToast } from 'src/api/toast'
import { useAfStore } from 'stores/antifreeze'

const store = useAfStore()
const unreadEvent = ref(0)
const unsubscribe = store.$onAction(({
  name
}) => {
  if (name === 'newEventStateAct') {
    getUnreadEventCount()
  }
})

async function getUnreadEventCount () {
  const data = await rest.eventUnreadCount()
  if (!data?.meta) {
    errorToast('Error get unread event count')
  } else {
    unreadEvent.value = data.data
  }
}
onMounted(async () => {
  await getUnreadEventCount()
})
onUnmounted(() => {
  unsubscribe()
})
</script>

<style scoped>
.dashboard-tab-main{
  background-color: #23555b;
  color: white;
}
</style>
