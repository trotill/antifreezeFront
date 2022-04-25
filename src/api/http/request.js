import { getToken, removeTokens, saveToken } from '../token.js'

async function refreshToken () {
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

    return res.json().then(errorBody => errorBody).catch(_ => ({ status, statusText }))
  })
}

export default {
  async get (api) {
    return xRequest('GET', api)
  },

  async post (api, data) {
    return xRequest('POST', api, data)
  },

  async put (api, data) {
    return xRequest('PUT', api, data)
  },

  async delete (api, data) {
    return xRequest('DELETE', api, data)
  }
}
