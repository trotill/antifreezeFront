<template>
  <group-container board-color='black' :x-size="tableWidth" :y-size="tableHeight" v-show="readyShow">
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
         <Date-filter :close="dateDialogClose" v-model:filter-date="filterDate"/>
        </div>
        <q-space/>
        <q-btn v-if="bigSize"  size="20px" outline color="primary" label="Read All" icon="cancel" @click="readAllDlgShow=true"/>
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
      <q-dialog v-model="readAllDlgShow">
        <q-card>

          <q-card-section>
            <div class="text-h6">Mark unread events as read?</div>
          </q-card-section>

          <q-card-section class="q-gutter-md" @keypress.enter="onClick">
            <div class="buttonDlgGroup">
              <q-btn color="red" @click="markUnreadAll">Mark</q-btn>
              <q-btn @click="readAllDlgShow=false">Cancel</q-btn>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </group-container>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import GroupContainer from './GroupContainer.vue'
import rest from 'src/api/http/route'
import { errorToast } from 'src/api/toast'
import eventDescriptionList from 'src/api/eventList'

import DateFilter from './DateFilter.vue'
import { useAfStore } from 'stores/antifreeze'

const store = useAfStore()
const pagination = ref({
  rowsPerPage: 10,
  rowsNumber: 10,
  page: 0,
  sortBy: 'ts',
  descending: true
})
const readyShow = ref(false)
const filterDate = ref(null)
const readAllDlgShow = ref(false)
const props = defineProps({
  bigSize: {
    type: Boolean,
    default: false
  }
})
const loading = ref(false)
const tableWidth = (props.bigSize) ? 8 : 4
const tableHeight = (props.bigSize) ? 6 : 6
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
async function markUnreadAll () {
  const result = await rest.setEventReadAll()
  if (result.statusText) {
    errorToast(`${result.statusText} (${result.status})`)
  }
  await eventDataRequest()
  store.newEventStateAct([])
  readAllDlgShow.value = false
}
async function onRequest (props) {
  loading.value = true

  const { page, rowsPerPage, sortBy, descending } = props.pagination
  eventListSqlRequest.offset = (page - 1) * rowsPerPage
  eventListSqlRequest.limit = rowsPerPage || pagination.value.rowsNumber
  eventListSqlRequest.order = [[sortNameTable[sortBy] ?? 'ts', (descending) ? 'desc' : 'asc']]
  if (filterDate.value) {
    const from = filterDate.value?.from ?? new Date(filterDate.value).getTime()
    const to = filterDate.value?.to ?? new Date(filterDate.value).getTime() + 86400000
    eventListSqlRequest.where = {
      ts: {
        $gte: +new Date(from),
        $lte: +new Date(to)
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

const unsubscribe = store.$onAction(({
  name
}) => {
  if (name === 'newEventStateAct') {
    eventDataRequest()
  }
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
  store.newEventStateAct([])
}
onMounted(async () => {
  await onRequest({ pagination: pagination.value })
  readyShow.value = true
})

onUnmounted(() => {
  unsubscribe()
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
.buttonDlgGroup{
  display: flex;
  justify-content: space-between;
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
