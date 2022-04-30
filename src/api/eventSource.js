import { fetchEventSource } from '@microsoft/fetch-event-source'
import { getToken } from './token.js'
import httpRoute from './http/route.js'

// class RetriableError extends Error { }

export default function fetchEventSourceWrap (route, commit) {
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
        if (topic === '/srv/footerDog') { commit('footerDogState', JSON.parse(data)) } else { commit('antifreezeState', JSON.parse(data)) }
      },
      onclose () {
      // if the server closes the connection unexpectedly, retry:
        console.log('fetchEventSource close')
        httpRoute.whoAmi().then(() => {
          fetchEventSourceWrap(route, commit)
        })
        // throw new RetriableError()
      },
      onerror (err) {
        console.log('fetchEventSource err', err)
      }
    })
}
