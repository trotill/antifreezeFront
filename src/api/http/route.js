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
  }
}
