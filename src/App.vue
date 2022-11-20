<template>
  <MainPage v-if="authorized" :mobile="!!md.mobile()"/>
  <router-view name="unAuthorized"  />
</template>

<script setup lang="ts">
import MainPage from 'pages/MainPage.vue'
import MobileDetect from 'mobile-detect'
// import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import eventSource from './api/eventSource.js'
import { useAfStore } from 'stores/antifreeze'

const router = useRouter()
const store = useAfStore()
const md = new MobileDetect(window.navigator.userAgent)
const body = document.getElementsByTagName('body')

if (md.mobile()) {
  body[0].style.width = 'fit-content'
  store.setMobileModeAct(true)
} else store.setMobileModeAct(false)

const authorized = computed(() => {
  if (store.authorized) {
    eventSource('/api/sse', store)
  }
  return store.authorized
})

window.onresize = function () {
  store.setWindowWidthAct(window.innerWidth)
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
