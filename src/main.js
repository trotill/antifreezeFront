import { createApp } from 'vue'
import { createStore } from 'vuex'
import { Quasar, Notify, Loading, QSpinnerFacebook } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import 'chartjs-adapter-moment'
import { router } from './router/routes.js'
import storeContent from './store/store.js'

const app = createApp(App)
const store = createStore(storeContent)

app.use(Quasar, {
  plugins: {
    Notify,
    Loading
  },
  config: {
    loading: {
      spinner: QSpinnerFacebook,
      spinnerColor: 'blue'
    }
  }
})
app.use(router)
app.use(store)
app.mount('#app')
