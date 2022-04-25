import { fetchEventSource } from '@microsoft/fetch-event-source'
import { getToken } from './token.js'

export default function (route, commit) {
  return fetchEventSource(route,
    {
      method: 'POST',
      headers: {
        access: getToken('access')
      },
      async onopen (response) {
        console.log('fetchEventSource response', response)
      },
      onmessage ({ event: topic, data }) {
        // debugger
        // console.log('fetchEventSource data', ev.event, ev.data)
        // "/srv/footerDog"
        if (topic === '/srv/footerDog') { commit('footerDogState', JSON.parse(data)) } else { commit('antifreezeState', JSON.parse(data)) }
      },
      onclose () {
      // if the server closes the connection unexpectedly, retry:
        console.log('fetchEventSource close')
      },
      onerror (err) {
        console.log('fetchEventSource err', err)
      }
    })
}
