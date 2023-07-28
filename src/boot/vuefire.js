import { boot } from 'quasar/wrappers'
import { VueFire } from 'vuefire'
import { app as firebaseApp } from './firebase'
export default boot(async ({ app }) => {
  app.use(VueFire, {
    firebaseApp,
    modules: [],
  })
})
