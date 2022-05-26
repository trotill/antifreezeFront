
import { createRouter, createWebHashHistory } from 'vue-router'

import Profile from '../pages/Profile.vue'
import Dashboard from '../pages/Dashboard.vue'
import Setting from '../pages/Setting.vue'
import Login from '../pages/Login.vue'
import Footer from '../pages/dashboard/Footer.vue'
import Event from '../pages/dashboard/Event.vue'
import History from '../pages/dashboard/History.vue'

export const defaultRoute = '/dashboard/footer'
const routes = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Login },
  {
    path: '/',
    component: Dashboard,
    children: [
      {
        path: '',
        components: {
          dashboard: Footer
        }
      }
    ]
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        components: {
          dashboard: Footer
        }
      },
      {
        path: 'footer',
        components: {
          dashboard: Footer
        }
      },
      {
        path: 'event',
        components: {
          dashboard: Event
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
