/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

import {onSnapshot, updateDoc} from 'firebase/firestore'
import { ROCRef } from 'boot/firebase'
import {SHEET_URL, zipObj} from "assets/constants";

self.skipWaiting()
clientsClaim()

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
    )
  )
}

let Client = null;
addEventListener('message',ev => {
  if(ev.data){
    if(ev.data.type === 'SetClient') Client = ev.source;
    if(ev.data.type === 'bookings') SetAndMonitor(ev.data.bookings);
  }
})
addEventListener('notificationclick', event => {
  const rootUrl = new URL('/', location).href;
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll().then(matchedClients => {
      for (let client of matchedClients) {
        if (client.url === rootUrl) { return client.focus(); }
      }
      return self.clients.openWindow("/");
    })
  );
});
let Bookings = {}, monitor = null;
function Pending(){ return Object.values(Bookings).filter(booking => booking.Status === 'Awaiting').map(booking => booking.Name) }
function SetAndMonitor(bookings){
  for (const No in bookings) Bookings[No] = bookings[No];
  if(!monitor){
     monitor = onSnapshot(ROCRef,dSnap => {
       let { Awaiting,Completed,Cancelled,Consulting,_app_update_ } = dSnap.data();
       if(_app_update_) {
         self.registration.update().then(() => updateDoc(ROCRef,{ _app_update_:false }))
       }
       if(Consulting && Bookings[Consulting]) Bookings[Consulting].Status = "Consulting";
       Awaiting.forEach(No => { if(!Bookings.hasOwnProperty(No) || Bookings[No].Status !== 'Awaiting') ItsANewBooking(No); })
       Cancelled.forEach(No => { if(Bookings.hasOwnProperty(No) && Bookings[No].Status !== 'Cancelled') ItsACancelledBooking(No); })
       Completed.forEach(No => { if(Bookings.hasOwnProperty(No) && Bookings[No].Status !== 'Completed') ItsACompletedBooking(No); })
       for (const No in Bookings) {
         if(Bookings[No].Status === 'Awaiting' && !Awaiting.includes(No)){
           if(Cancelled.includes(No)) ItsACancelledBooking(No)
           else {
             if(Completed.includes(No)) Bookings[No].Status = 'Completed'
             if(Consulting === No) Bookings[No].Status = 'Consulting'
           }
         } else {
           if(Bookings[No].Status === 'Cancelled' && !Cancelled.includes(No)){
             if(Awaiting.includes(No)) ItsANewBooking(No)
             else {
               if(Completed.includes(No)) Bookings[No].Status = 'Completed'
               if(Consulting === No) Bookings[No].Status = 'Consulting'
             }
           } else {
             if(Bookings[No].Status === 'Completed' && !Completed.includes(No)){
               if(Awaiting.includes(No)) ItsANewBooking(No)
               else {
                 if(Cancelled.includes(No)) ItsACancelledBooking(No)
                 if(Consulting === No) Bookings[No].Status = 'Consulting'
               }
             }
           }
         }
       }
     })
  }
}
function ItsACancelledBooking(No){
  if(!Bookings.hasOwnProperty(No)){
    const url = SHEET_URL + '?action=s02&head=true&no=' + No;
    fetch(url).then(resp => resp.json()).then(nB => {
      let nB2 = zipObj(nB.head,nB.booking);
      Bookings[nB2.No] = nB2;
      if(Bookings[No].Status === "Cancelled"){
        FireNotification("Booking Cancelled",`Token Number ${No} of ${Bookings[No].Name} has been cancelled..`,No)
        FireNotification("Awaiting Bookings",Pending().length ? `Total ${Pending().length} Bookings Awaiting. Waiting list: ${Pending().join(', ')}` : 'There are no any bookings pending now..','rocpending')
      }
    })
  } else {
    Bookings[No].Status = "Cancelled"
    FireNotification("Booking Cancelled",`Token Number ${No} of ${Bookings[No].Name} has been cancelled..`,No)
    FireNotification("Awaiting Bookings",Pending().length ? `Total ${Pending().length} Bookings Awaiting. Waiting list: ${Pending().join(', ')}` : 'There are no any bookings pending now..','rocpending')
  }
}
function ItsACompletedBooking(No){
  if(!Bookings.hasOwnProperty(No)){
    const url = SHEET_URL + '?action=s02&head=true&no=' + No;
    fetch(url).then(resp => resp.json()).then(nB => {
      let nB2 = zipObj(nB.head,nB.booking);
      Bookings[nB2.No] = nB2;
      if(Bookings[No].Status === "Completed"){
        self.registration.getNotifications({ tag:No }).then(notification => notification.close())
      }
    })
  } else {
    Bookings[No].Status = "Completed"
    self.registration.getNotifications({ tag:No }).then(notification => notification.close())
  }
}
function ItsANewBooking(No){
  const url = SHEET_URL + '?action=s02&head=true&no=' + No;
  fetch(url).then(resp => resp.json()).then(nB => {
    let nB2 = zipObj(nB.head,nB.booking);
    Bookings[nB2.No] = nB2;
    FireNotification('New Booking',`${nB2.Name} Booked just now. Token Number assigned is: ${nB2.No}.`,No)
    FireNotification("Awaiting Bookings",Pending().length ? `Total ${Pending().length} Bookings Awaiting. Waiting list: ${Pending().join(', ')}` : 'There are no any bookings pending now..','rocpending')
  })
}

function FireNotification(title,body,tag){
  let notifyOptions = {
    body, tag, renotify: true, data: { time:new Date().getTime(),booking:title === 'New Booking' },
    image: 'https://rafshiadmin.web.app/image.jpg', badge: 'https://rafshiadmin.web.app/badge.jpg', icon: 'https://rafshiadmin.web.app/icon.jpg',
    actions: [{ title:'View in Application',action:'rocopen' }]
  }
  self.registration.showNotification(title, notifyOptions).then(null)
}
setInterval(() => {
  self.registration.getNotifications().then(notifies => {
    notifies.forEach(notification => {
      let { time,booking } = notification.data;
      if(!booking) return true;
      if(new Date().getTime() - time > 120000) FireNotification(notification.title,notification.body,notification.tag)
    })
  })
},60000)
