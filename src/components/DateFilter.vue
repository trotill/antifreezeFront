<template>
  <div class="inputDateMain">
    <q-input dark outlined :model-value="formattedFilterDate.from+' - '+formattedFilterDate.to" readonly>
      <template v-slot:append>
        <q-icon name="event" color="primary" class="cursor-pointer">
          <q-popup-proxy  cover transition-show="scale" transition-hide="scale" @hide ="close">
            <q-date dark range :model-value="filterDate" @update:modelValue="emit('update:filterDate', $event)">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
      <template v-slot:prepend>
        <q-icon name="close" color="primary" class="cursor-pointer" @click="emit('update:filterDate', null);close()">
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
const props = defineProps({
  close: {
    type: Function
  },
  filterDate: Object
})

const emit = defineEmits(['update:filterDate'])
// const filterDate = ref(null)
const formattedFilterDate = computed(() => {
  if (!props.filterDate) {
    return { from: 'YYYY/MM/DD', to: 'YYYY/MM/DD' }
  }
  return (props.filterDate?.from) ? props.filterDate : { from: props.filterDate, to: props.filterDate }
})
</script>

<style scoped>
.inputDateMain{
  min-width: 320px;
}
</style>
