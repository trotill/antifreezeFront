export interface FooterDogState{
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
}
