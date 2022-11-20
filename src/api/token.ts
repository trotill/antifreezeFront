export function removeTokens () {
  localStorage.setItem('refresh', '')
  localStorage.setItem('access', '')
}

export function saveToken (type:string, token:string) {
  localStorage.setItem(type, token)
}

export function getToken (type:string):string|null {
  return localStorage.getItem(type)
}
