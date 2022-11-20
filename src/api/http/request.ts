import { getToken, removeTokens, saveToken } from '../token'
import { Loading } from 'quasar'
import { Request, XRequestOut } from 'src/api/types/requestTypes'

export async function refreshToken () {
  // eslint-disable-next-line no-undef
  const headers:HeadersInit = {
    refresh: getToken('refresh') ?? ''
  }
  return fetch(
    '/api/refresh', {
      method: 'GET',
      headers: new Headers(headers)
    }
  )
}

async function xRequest (method:string, api:string, data = ''):Promise<XRequestOut> {
  let body
  // eslint-disable-next-line no-undef
  const headers:HeadersInit = {}
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    body = (typeof data === 'object')
      ? (headers['content-type'] = 'application/json', JSON.stringify(data))
      : (headers['content-type'] = 'text/plain', data)
  }
  headers.access = getToken('access') ?? ''
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
          if (!access) { return { status, statusText } }
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

async function xRequestWLoading (method:string, api:string, data:any) {
  Loading.show()
  const result = await xRequest(method, api, data)
  Loading.hide()
  return result
}

const request = [
  xRequest, xRequestWLoading
]
export default {
  async get ({ api, loading = true }:Request) {
    return request[+loading]('GET', api)
  },

  async post ({ api, data, loading = true }:Request) {
    return request[+loading]('POST', api, data)
  },

  async put ({ api, data, loading = true }:Request) {
    return request[+loading]('PUT', api, data)
  },

  async delete ({ api, data, loading = true }:Request) {
    return request[+loading]('DELETE', api, data)
  }
}
