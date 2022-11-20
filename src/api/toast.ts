import { Notify } from 'quasar'

export function errorToast (message) {
  Notify.create({
    message,
    type: 'negative'
  })
}
