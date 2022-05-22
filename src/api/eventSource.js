import { fetchEventSource } from '@microsoft/fetch-event-source'
import { getToken } from './token.js'
import httpRoute from './http/route.js'

export default function fetchEventSourceWrap (route, commit) {
  return fetchEventSource(route,
    {
      method: 'POST',
      headers: {
        access: getToken('access')
      },
      async onopen () {
      },
      onmessage ({ event: topic, data }) {
        switch (topic) {
          case '/srv/footerDog':{
            commit('footerDogState', JSON.parse(data))
            break
          }
          case '/srv/antiFreeze':{
            commit('antifreezeState', JSON.parse(data))
            break
          }
          case 'eventBroad':{
            commit('newEventState', JSON.parse(data))
            break
          }
        }
      },
      onclose () {
        httpRoute.whoAmi().then(() => fetchEventSourceWrap(route, commit))
      },
      onerror () {
      }
    })
}
