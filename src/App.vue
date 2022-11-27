<template>
  <MainPage v-if="authorized" :mobile="!!isMobile"/>
  <router-view name="unAuthorized"  />
</template>

<script setup lang="ts">
import MainPage from 'pages/MainPage.vue'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import eventSource from './api/eventSource'
import { useAfStore } from 'stores/antifreeze'
import { useQuasar } from 'quasar'
import { FooterDogState } from 'src/api/types/footerDogTypes'
import { AntifreezeState } from 'src/api/types/antifreezeTypes'
import { NewEventState, StoreActions } from 'src/api/types/storeState'
import { PREFIX } from 'src/api/const'
const $q = useQuasar()
const router = useRouter()
const store = useAfStore()

const isMobile = $q.platform.is.mobile

const body = document.getElementsByTagName('body')

store.isMobile = isMobile ?? false
if (isMobile) { body[0].style.width = 'fit-content' }

const storeActions:StoreActions = {
  footerDogStateAct: (payload:FooterDogState) => store.footerDogStateAct(payload),
  antifreezeStateAct: (payload:AntifreezeState) => store.antifreezeStateAct(payload),
  newEventStateAct: (payload:NewEventState) => store.newEventStateAct(payload)
}
const authorized = computed(() => {
  if (store.authorized) {
    eventSource(`${PREFIX}/api/sse`, storeActions)
  }
  return store.authorized
})

window.onresize = function () {
  store.windowWidth = window.innerWidth
}

onMounted(async () => {
  const ami = await store.whoAmiAct()
  if (!ami) {
    await router.push('/login')
  }
})

</script>

<style lang="scss">
@import "src/css/main";
#q-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: $dashboard-color;

}

</style>
