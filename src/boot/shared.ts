import { boot } from 'quasar/wrappers'
import 'chartjs-adapter-moment'

export default boot(({ app }) => {
  console.log('shared')
})
