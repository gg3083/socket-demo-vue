import Cookies from 'js-cookie'

const TokenKey = 'vue_timesheet_token-001'

export const UUID_KEY = 'socket-uuid-001'



export function getToken() {
  return Cookies.get(TokenKey)
}

export function getCookies( key ) {
  return Cookies.get(key)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setCookies( key,values ) {
  return Cookies.set(key,JSON.stringify(values))
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function saveStorage(key, items) {
  return window.localStorage.setItem(key, JSON.stringify(items))
}

export function getStorage(key) {
  const item = window.localStorage.getItem(key)
  if (item) {
    return JSON.parse(item)
  }
  return null
}

export function delStorage(key) {
  return window.localStorage.removeItem(key)
}

