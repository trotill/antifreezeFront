export function removeTokens () {
  localStorage.setItem('refresh', '')
  localStorage.setItem('access', '')
}

export function saveToken (type, token) {
  localStorage.setItem(type, token)
}

export function getToken (type) {
  return localStorage.getItem(type)
}
