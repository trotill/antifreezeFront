import { fetchEventSource } from '@microsoft/fetch-event-source'
import { getToken } from './token'
import httpRoute from './http/route'
import { StoreActions } from 'src/api/types/storeState'

export default function fetchEventSourceWrap (route:string, store:StoreActions) {
  return fetchEventSource(route,
    {
      method: 'POST',
      headers: {
        access: getToken('access') as string
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
