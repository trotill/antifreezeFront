import httpRoute from '../api/http/route.js'
import { Notify } from 'quasar'

function errorToast (message) {
  Notify.create({
    message,
    type: 'negative'
  })
}
export default {
  state () {
    return {
      whoAmi: null,
      authorized: false,
      footerDogState: {
        relay: {
          relay12V: 0, // реле всей слаботочки
          relayBath: 0 // реле бани
        },
        wifi: { rssi: 0, ch: 0 },
        freeMem: 0,
        waitDevTimeout: 0, // время ожидания выхода устройства на связь, после кот. происходит перезагрузка
        selfRebootCntr: 0, // кол. самоперезагрузок до сброса antifreeze
        countdown: 0, // рестарт вачдога через (сек)
        rebootCntr: 0, // кол. перезагрузок линии 12В
        devRebootCntr: 0, // кол. перезагрузок вачдога
        ip: '--.--.--.--',
        v: '--', // версия ПО
        footerMode: 0// ручной/автоматич. режим
      },
      antifreezeState: {
        relay: { heater: 0, pump: 0 }, // состояние реле насоса и обогрева
        stat: {
          ts: 0, // текущее время в сек
          pwrLStart: 0, // время пропажи питания 220В
          pwrLStop: 0, // время восстановления питания 220В
          pwrLIter: 0, // сколько всего не было питания 220В
          pwrLTotal: 0, // длительность последнего пропадания питания 220В
          pumpStart: 0, // время вкл. насоса
          pumpStop: 0, // время выкл. насоса
          pumpIter: 0, // скольк раз вкл/выкл насос
          pumpTotal: 0, // длительность последней выкачки
          heatStart: 0, // время вкл. греющего кабеля
          heatStop: 0, // время выкл. греющего кабеля
          heatIter: 0, // сколько раз вкл/выкл греющий кабель
          heatTotal: 0// время последнего вкл. греющего кабеля
        },
        powerLoss: 0, // 1-питание 220В отстутвует
        ac0: { // измеритель мощности 220В
          voltage: 0, // текущее напряжение
          current: 0, // текущий ток
          power: 0, // текущая мощность
          energy: 0,
          freq: 0, // частота сети
          powerFact: 0,
          alarm: 0
        },
        md02Main:
          { temp: 0, humi: 0 }, // температура/влажность
        device: {
          relayHeaterAvail: 0, // реле греющего кабеля на MODBUS доступно
          relayPumpAvail: 0, // реле насоса на MODBUS доступно
          acAvail: 0, // измеритель мощности на MODBUS доступен
          pumpWorkTime: 0, // макс. время непрерывной работы насоса
          heaterWorkTime: 0, // макс. время непрерывной работы греющего кабеля
          pumpMaxPower: 0// макс. допустимая мощность насоса
        },
        wifi: { rssi: 0, ch: 0 },
        autoMode: {
          mode: 0, // режим ручной/автоматич
          state: 0 // состояние алгоритма в автоматич. режиме
        },
        freeMem: 0,
        msgId: 0, // id сообщения
        rebootCntr: 0, // кол. перезагрузок
        message: '--', // сообщение
        ip: '--.--.--.--',
        v: '--', // версия ПО
        pumpWork: 0// наличие напряжение 220В
      }
    }
  },
  mutations: {
    whoAmi (state, ami) {
      state.whoAmi = ami
    },
    authorized (state, auth) {
      state.authorized = auth
    },
    footerDogState (state, payload) {
      state.footerDogState = payload
    },
    antifreezeState (state, payload) {
      state.antifreezeState = payload
    }
  },
  actions: {
    async login ({ commit }, { login, password }) {
      const result = await httpRoute.login({ login, password })
      if (result.meta) {
        if (result.meta.error) {
          commit('authorized', false)
          errorToast(result.meta.error)
          return false
        } else {
          commit('authorized', true)
          return true
        }
      }
      return null
    },
    async whoAmi ({ commit }) {
      const result = await httpRoute.whoAmi()
      if (result?.meta) {
        console.log('whoAmi Succ', result)
        commit('whoAmi', result.data)
        commit('authorized', true)
        return result.data
      } else {
        console.log('whoAmi Err', result)
        errorToast(result.statusText)
        if (result.status === 401) { commit('authorized', false) }
        return null
      }
    }
  }
}