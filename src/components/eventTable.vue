<template>
  <group-container board-color='black' :x-size="graphWidth" :y-size="graphHeight" v-show="readyShow">
    <div class="tableContainer">
    <q-table
      style="height: 100%"
      title="Event"
      :rows="rows"
      card-class="tableEventMain"
      dense
      dark
      :columns="columns"
      row-key="name"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template v-slot:top>
        <div class="inputDateMain">
        <q-input  dark outlined :model-value="formattedFilterDate.from+' - '+formattedFilterDate.to" readonly>
          <template v-slot:append>
            <q-icon name="event" color="white" class="cursor-pointer">
              <q-popup-proxy  cover transition-show="scale" transition-hide="scale" @hide ="dateDialogClose">
                <q-date dark range v-model="filterDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:prepend>
            <q-icon name="close" color="white" class="cursor-pointer" @click="filterDate=null;dateDialogClose()">
            </q-icon>
          </template>
        </q-input>
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td :key=key v-for="(rowItem,key) in props.row" class="tableEventTr" :props="props">
            <div v-if="key!=='read'" :class="{'tableEventTr-readed':props.row.read}">{{rowItem}}</div>
            <div v-if="key==='read'" :class="{'tableEventTr-readed':props.row.read}">
              <q-btn :disabled="props.row.read"  size="sm" :style="{background: (props.row.read)?'#565656':'#a80000'}" label="Read" @click="readClick(props.row.id)"/>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    </div>
  </group-container>
</template>

<script setup>
import { onMounted, ref, onUnmounted, computed } from 'vue'
import GroupContainer from './GroupContainer.vue'
import rest from '../api/http/route.js'
import { errorToast } from '../api/toast'
import eventDescriptionList from '../api/eventList.js'
import { useStore } from 'vuex'

const store = useStore()
const pagination = ref({
  rowsPerPage: 10,
  rowsNumber: 10,
  page: 0,
  sortBy: 'ts',
  descending: true
})
const readyShow = ref(false)
const filterDate = ref(null)
const formattedFilterDate = computed(() => {
  if (!filterDate.value) {
    return { from: 'YYYY/MM/DD', to: 'YYYY/MM/DD' }
  }
  return (filterDate.value?.from) ? filterDate.value : { from: filterDate.value, to: filterDate.value }
})
const prop = defineProps({
  bigSize: {
    type: Boolean,
    default: false
  }
})
const loading = ref(false)
const graphWidth = (prop.bigSize) ? 8 : 4
const graphHeight = (prop.bigSize) ? 6 : 6
const columns = [
  { field: 'time', name: 'time', align: 'center', label: 'Date/Time', sortable: true },
  { field: 'description', name: 'description', align: 'left', label: 'Description', sortable: true },
  { field: 'status', name: 'status', align: 'left', label: 'Status', sortable: true },
  { field: 'read', name: 'read', align: 'left', label: '', sortable: true }
]

const rows = ref([])
const eventListSqlRequest = {
  where: {},
  order: [['ts', 'desc']],
  limit: 10
}
const sortNameTable = {
  read: 'read',
  time: 'ts',
  desc: 'eventId',
  status: 'status'
}
function dateDialogClose () {
  onRequest({ pagination: pagination.value })
}
async function onRequest (props) {
  loading.value = true

  const { page, rowsPerPage, sortBy, descending } = props.pagination
  eventListSqlRequest.offset = (page - 1) * rowsPerPage
  eventListSqlRequest.limit = rowsPerPage || pagination.value.rowsNumber
  eventListSqlRequest.order = [[sortNameTable[sortBy] ?? 'ts', (descending) ? 'desc' : 'asc']]
  if (filterDate.value) {
    eventListSqlRequest.where = {
      ts: {
        $gte: +new Date(filterDate.value.from),
        $lte: +new Date(filterDate.value.to)
      }
    }
  } else {
    eventListSqlRequest.where = {}
  }
  await eventDataRequest()
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending
  loading.value = false
}
function parseEventDescription ({ value, eventId }) {
  let descriptionTmp = eventDescriptionList?.[eventId]?.desc || eventId

  const parsedValue = JSON.parse(value)
  Object.entries(parsedValue).forEach(([name, value]) => {
    descriptionTmp = descriptionTmp.replaceAll(`{{${name}}}`, value)
  })
  return descriptionTmp
}

const unsubscribe = store.subscribe((mutation) => {
  if (mutation.type === 'newEventState') {
    eventDataRequest()
  }
})

onUnmounted(() => {
  unsubscribe()
})

async function eventDataRequest () {
  const eventData = await rest.getEventList(eventListSqlRequest)
  if (!eventData?.meta) {
    errorToast('Error read event data')
  } else {
    const { id = [], ts = [], eventId = [], status = [], read = [], prio = [], value = [] } = eventData.data.list ?? {};
    ({ count: pagination.value.rowsNumber } = eventData.data)

    rows.value = []
    ts.forEach((tsItem, idx) => {
      rows.value.push({
        time: new Date(tsItem).toLocaleString(),
        description: `${parseEventDescription({ eventId: eventId[idx], value: value[idx] })} (${eventId[idx]})`,
        status: (status[idx]) ? 'term' : 'continue',
        read: read[idx],
        prio: prio[idx],
        id: id[idx]
      })
    })
  }
}
async function readClick (id) {
  const result = await rest.setEventRead(id)
  if (result.statusText) {
    errorToast(`${result.statusText} (${result.status})`)
  }
  await eventDataRequest()
  store.commit('newEventState', [])
}
onMounted(async () => {
  await onRequest({ pagination: pagination.value })
  readyShow.value = true
})
</script>

<style lang="scss" scoped>
.alarm-main_block{
  width: 100%;
}
.tableContainer{
  width: 100%;
  height: 100%;
}
.tableEventTr{
  background-color: #3a3a3a;
  &-readed{
    color: #989f9e;
  }
}
.tableEventMain{
  background-color: #333333;
  color: #ffffff;
}
.inputDateMain{
  min-width: 320px;
}
::v-deep(.q-icon){
  font-size: 40px!important;
}
::v-deep(.q-table__container > div:last-child){
  font-size: 20px!important;
}
::v-deep(.q-table__bottom-item){
  font-size: 20px!important;
}
::v-deep(th){
  font-size: 20px;
}
</style>
