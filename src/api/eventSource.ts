// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { fetchEventSource } from '@microsoft/fetch-event-source'
import { getToken } from './token'
import httpRoute from './http/route'

export default function fetchEventSourceWrap (route, store) {
  return fetchEventSource(route,
    {
      method: 'POST',
      headers: {
        access: getToken('access')
      },
      onmessage ({ event: topic, data }) {
        switch (topic) {
          case '/srv/footerDog':{
            store.footerDogStateAct(JSON.parse(data))
            break
          }
          case '/srv/antiFreeze':{
            store.antifreezeStateAct(JSON.parse(data))
            break
          }
          case 'eventBroad':{
            store.newEventStateAct(JSON.parse(data))
            break
          }
        }
      },
      onclose () {
        httpRoute.whoAmi().then(() => fetchEventSourceWrap(route, store))
      }
    })
}
