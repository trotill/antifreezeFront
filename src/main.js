import { createApp } from 'vue'
import { createStore } from 'vuex'
import { Quasar, Notify } from 'quasar'
import mitt from 'mitt'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'

import { router } from './router/routes.js'
import storeContent from './store/store.js'

const emitter = mitt()
const app = createApp(App)
const store = createStore(storeContent)

app.use(Quasar, {
  plugins: {
    Notify
  } // import Quasar plugins and add here
})
app.use(router)
app.use(store)
app.mount('#app')
