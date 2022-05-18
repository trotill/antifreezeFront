<script setup>

import Main from './pages/Main.vue'
import MobileDetect from 'mobile-detect'
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { defaultRoute } from './router/routes.js'
import eventSource from './api/eventSource.js'

const router = useRouter()
const store = useStore()
const md = new MobileDetect(window.navigator.userAgent)
const body = document.getElementsByTagName('body')
if (md.mobile()) {
  body[0].style.width = 'fit-content'
  store.commit('setMobileMode', true)
} else store.commit('setMobileMode', false)

const authorized = computed(() => {
  if (store.state.authorized) {
    eventSource('/api/sse', store.commit)
  }
  return store.state.authorized
})

onMounted(async () => {
  const ami = await store.dispatch('whoAmi')
  console.log('ami', ami)
  if (!ami) {
    await router.push('/login')
  }
})

</script>

<template  >
    <Main v-if="authorized" :mobile="!!md.mobile()"/>
    <router-view name="unAuthorized"  />
</template>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: $dashboard-color;

}

</style>
