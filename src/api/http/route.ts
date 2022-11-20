// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import http from './request.js'
import jshashes from 'jshashes'

import { AccountLoginPassword } from 'src/api/types/accountTypes'

const calcPassword = (login:string, password:string) => new jshashes.SHA1().b64(login + password)
export default {
  async login ({ login, password }:AccountLoginPassword) {
    return http.post({
      api: '/api/login',
      data: { login, password: calcPassword(login, password) }
    })
  },
  async whoAmi (loading = false) {
    return http.get({ api: '/api/whoAmi', loading })
  },
  async setDevData (data:any, type:string) {
    return http.post({
      api: `/api/setDevData/?type=${type}`,
      data
    })
  },
  async getSensorList (data:any, loading = true) {
    return http.post({
      api: '/api/sensorList',
      data,
      loading
    })
  },
  async getEventList (data:any) {
    return http.post({ api: '/api/eventList', data })
  },
  async getUser () {
    return http.get({ api: '/api/user' })
  },
  async getUserList () {
    return http.get({ api: '/api/userList' })
  },
  async setEventRead (eventId:string) {
    return http.post({ api: `/api/eventRead/${eventId}`, data: {} })
  },
  async setEventReadAll () {
    return http.post({ api: '/api/eventReadAll', data: {} })
  },
  async eventUnreadCount () {
    return http.get({ api: '/api/eventUnreadCount' })
  },
  async createUser (userData:AccountLoginPassword) {
    const { password, login } = userData
    userData.password = calcPassword(login, password)
    return http.post({ api: '/api/user/', data: userData })
  },
  async changeUser (userData:AccountLoginPassword) {
    const { password, login } = userData
    userData.password = calcPassword(login, password)
    return http.put({ api: '/api/user/', data: userData })
  },
  async changeUserGroup (userData:AccountLoginPassword) {
    return http.put({ api: '/api/userGroup/', data: userData })
  }
}