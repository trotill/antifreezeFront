import { RouteRecordRaw } from 'vue-router'
import Profile from 'pages/ProfilePage.vue'
import Dashboard from 'pages/DashboardPage.vue'
import Setting from 'pages/SettingPage.vue'
import Login from 'pages/LoginPage.vue'
import Footer from 'pages/dashboard/FooterDashboard.vue'
import Event from 'pages/dashboard/EventDashboard.vue'
import History from 'pages/dashboard/HistoryDashboard.vue'

export const defaultRoute = '/dashboard/footer'

const routes: RouteRecordRaw[] = [
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

export default routes
