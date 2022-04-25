
import { createRouter, createWebHashHistory } from 'vue-router'

import Profile from '../pages/Profile.vue'
import Dashboard from '../pages/Dashboard.vue'
import Setting from '../pages/Setting.vue'
import Login from '../pages/Login.vue'
import Antifreeze from '../pages/dashboard/Antifreeze.vue'
import Alarm from '../pages/dashboard/Alarm.vue'
import History from '../pages/dashboard/History.vue'

export const defaultRoute = '/dashboard/antifreeze'
const routes = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Login },
  { path: '/', component: Dashboard },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      {
        path: 'antifreeze',
        components: {
          dashboard: Antifreeze
        }
      },
      {
        path: 'alarm',
        components: {
          dashboard: Alarm
        }
      },
      {
        path: 'history',
        components: {
          dashboard: History
        }
      }
    ]
  },
  { path: '/profile', component: Profile },
  { path: '/setting', component: Setting },
  {
    path: '/login',
    components: {
      unAuthorized: Login
    }
  }

]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
