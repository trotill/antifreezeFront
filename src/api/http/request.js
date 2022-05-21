import { getToken, removeTokens, saveToken } from '../token.js'
import { Loading } from 'quasar'

export async function refreshToken () {
  return fetch(
    '/api/refresh', {
      method: 'GET',
      headers: {
        refresh: getToken('refresh')
      }
    }
  )
}

async function xRequest (method, api, data = '') {
  let body
  const headers = {}
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    body = (typeof data === 'object')
      ? (headers['content-type'] = 'application/json', JSON.stringify(data))
      : (headers['content-type'] = 'text/plain', data)
  }
  headers.access = getToken('access')
  return fetch(
    `${api}`, {
      method,
      headers,
      body
    }
  ).then(res => {
    const { status, statusText } = res

    if (status === 401) {
      removeTokens()
    }
    if (status === 511) {
      return refreshToken().then(result => {
        return result.json().then((tokens) => {
          const { access, refresh } = tokens
          saveToken('access', access)
          saveToken('refresh', refresh)
          return xRequest(method, api, data)
        }).catch(_ => ({ status, statusText }))
      })
    }
    if (status === 204) return {}

    if (status === 200) {
      return res.json().then((result) => {
        const { access, refresh } = result.meta.token
        saveToken('access', access)
        saveToken('refresh', refresh)
        return result
      }).catch(() => statusText)
    }

    return res.json().then(errorBody => ({ statusText: errorBody.message ?? statusText, status })).catch(_ => ({ status, statusText }))
  })
}

async function xRequestWLoading (method, api, data) {
  Loading.show()
  const result = await xRequest(method, api, data)
  Loading.hide()
  return result
}
export default {
  async get (api) {
    return xRequestWLoading('GET', api)
  },

  async post (api, data) {
    return xRequestWLoading('POST', api, data)
  },

  async put (api, data) {
    return xRequestWLoading('PUT', api, data)
  },

  async delete (api, data) {
    return xRequestWLoading('DELETE', api, data)
  }
}
