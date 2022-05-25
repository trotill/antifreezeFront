import http from './request.js'
import jshashes from 'jshashes'

const calcPassword = (login, password) => new jshashes.SHA1().b64(login + password)
export default {
  async login ({ login, password }) {
    return http.post({
      api: '/api/login',
      data: { login, password: calcPassword(login, password) }
    })
  },
  async whoAmi (loading) {
    return http.get({ api: '/api/whoAmi', loading })
  },
  async setDevData (data, type) {
    return http.post({
      api: `/api/setDevData/?type=${type}`,
      data
    })
  },
  async getSensorList (data, loading = true) {
    return http.post({
      api: '/api/sensorList',
      data,
      loading
    })
  },
  async getEventList (data) {
    return http.post({ api: '/api/eventList', data })
  },
  async getUser () {
    return http.get({ api: '/api/user' })
  },
  async getUserList () {
    return http.get({ api: '/api/userList' })
  },
  async setEventRead (eventId) {
    return http.post({ api: `/api/eventRead/${eventId}`, data: {} })
  },
  async setEventReadAll () {
    return http.post({ api: '/api/eventReadAll', data: {} })
  },
  async eventUnreadCount () {
    return http.get({ api: '/api/eventUnreadCount' })
  },
  async createUser (userData) {
    const { password, login } = userData
    userData.password = calcPassword(login, password)
    return http.post({ api: '/api/user/', data: userData })
  },
  async changeUser (userData) {
    const { password, login } = userData
    userData.password = calcPassword(login, password)
    return http.put({ api: '/api/user/', data: userData })
  },
  async changeUserGroup (userData) {
    return http.put({ api: '/api/userGroup/', data: userData })
  }
}
