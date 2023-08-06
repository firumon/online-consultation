import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  Notification.requestPermission().then(permission => {
    if(permission === 'granted'){
      try {
        navigator.serviceWorker.ready.then(swr => {
          navigator.serviceWorker.addEventListener('message',evt => {
            if(evt.data.type === 'notify') { swr.showNotification(evt.data.content.title,evt.data.content.notifyOptions) }
          })
          navigator.serviceWorker.controller?.postMessage({ type:'SetClient',from:'boot/notification' })
        })
      } catch (e){
        console.log(e)
      }
    }
  })
})
