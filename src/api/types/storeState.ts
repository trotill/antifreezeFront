export interface StoreState{
  whoAmi: boolean|null,
  authorized: boolean,
  isMobile: boolean,
  windowWidth: number,
  newEventState: string[],
  footerDogState: {
    relay: {
      relay12V: number, // реле всей слаботочки
      relayBath: number // реле бани
    },
    wifi: { rssi: number, ch: number },
    freeMem: number,
    waitDevTimeout: number, // время ожидания выхода устройства на связь, после кот. происходит перезагрузка
    selfRebootCntr: number, // кол. самоперезагрузок до сброса antifreeze
    countdown: number, // рестарт вачдога через (сек)
    rebootCntr: number, // кол. перезагрузок линии 12В
    devRebootCntr: number, // кол. перезагрузок вачдога
    ip: string,
    v: string, // версия ПО
    footerMode: number// ручной/автоматич. режим
  },
  antifreezeState: {
    relay: { heater: number, pump: number }, // состояние реле насоса и обогрева
    stat: {
      ts: number, // текущее время в сек
      pwrLStart: number, // время пропажи питания 220В
      pwrLStop: number // время восстановления питания 220В
      pwrLIter: number // сколько всего не было питания 220В
      pwrLTotal: number, // длительность последнего пропадания питания 220В
      pumpStart: number, // время вкл. насоса
      pumpStop: number // время выкл. насоса
      pumpIter: number, // скольк раз вкл/выкл насос
      pumpTotal: number, // длительность последней выкачки
      heatStart: number, // время вкл. греющего кабеля
      heatStop: number, // время выкл. греющего кабеля
      heatIter: number, // сколько раз вкл/выкл греющий кабель
      heatTotal: number// время последнего вкл. греющего кабеля
    },
    powerLoss: number, // 1-питание 220В отстутвует
    ac0: { // измеритель мощности 220В
      voltage: number, // текущее напряжение
      current: number, // текущий ток
      power: number, // текущая мощность
      energy: number,
      freq: number, // частота сети
      powerFact: number,
      alarm: number
    },
    md02Main:
      { temp: number, humi: number }, // температура/влажность
    device: {
      relayHeaterAvail: number, // реле греющего кабеля на MODBUS доступно
      relayPumpAvail: number, // реле насоса на MODBUS доступно
      acAvail: number, // измеритель мощности на MODBUS доступен
      pumpWorkTime: number, // макс. время непрерывной работы насоса
      heaterWorkTime: number, // макс. время непрерывной работы греющего кабеля
      pumpMaxPower: number// макс. допустимая мощность насоса
    },
    wifi: { rssi: number, ch: number },
    autoMode: {
      mode: number, // режим ручной/автоматич
      state: number // состояние алгоритма в автоматич. режиме
    },
    freeMem: number,
    msgId: number, // id сообщения
    rebootCntr: number, // кол. перезагрузок
    message: string, // сообщение
    ip: string,
    v: string, // версия ПО
    pumpWork: number// наличие напряжение 220В
  }
}
