import http from './request.js'
import jshashes from 'jshashes'

export default {
  async login ({ login, password }) {
    return http.post('/api/login', { login, password: new jshashes.SHA1().b64(login + password) })
  },
  async whoAmi () {
    return http.get('/api/whoAmi')
  },
  async setDevData (data, type) {
    return http.post(`/api/setDevData/?type=${type}`, data)
  },
  async getSensorList (data) {
    return http.post('/api/sensorList', data)
  },
  async getEventList (data) {
    return http.post('/api/eventList', data)
  },
  async setEventRead (eventId) {
    return http.post(`/api/eventRead/${eventId}`, {})
  },
  async eventUnreadCount () {
    return http.get('/api/eventUnreadCount')
  },
  async createUser (userData) {
    const { password, login } = userData
    userData.password = new jshashes.SHA1().b64(login + password)
    return http.post('/api/user/', userData)
  },
  async changeUser (userData) {
    return http.put('/api/user/', userData)
  },
  async changeUserGroup (userData) {
    return http.put('/api/userGroup/', userData)
  }
}
