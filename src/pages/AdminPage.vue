<template>
  <q-page class="flex flex-center q-gutter-y-sm" padding>
    <DoctorConsulting v-if="DOCState && DOCState.Consulting>0" :consulting="DOCState.Consulting" :bookings="bookings" @cancelling="misc.cancelling = $event" />
    <AwaitingBookings :online="DOCState && DOCState.status === 'Online'" :bookings="bookings" @cancelling="misc.cancelling = $event" :head="misc.head" :live="misc.online" />
    <q-dialog v-model="cancel" persistent full-width><CancelConfirm v-bind="misc.cancelling" @cancelled="cancelled" /></q-dialog>
    <q-inner-loading :showing="misc.loading"><q-spinner-facebook size="xl" color="primary" /></q-inner-loading>
  </q-page>
</template>

<script setup>
import DoctorConsulting from "components/DoctorConsulting.vue";
import AwaitingBookings from "components/AwaitingBookings.vue";
import {SET_BOOKINGS} from "assets/booking";
import {SHEET_URL, zipObj} from "assets/constants";
import {computed, inject, onMounted, reactive, ref, watch} from "vue";
import CancelConfirm from "components/CancelConfirm.vue";

const misc = reactive({ loading:true,head:null,cancelling:null,synced:false,online:[],offline:[] })
const bookings = ref({})

const DOCState = inject('DOCState')

const cancel = computed({
  get(){ return misc.cancelling !== null },
  set(){ return misc.cancelling = null }
})

watch(() => DOCState.value,({ Awaiting,Cancelled,Completed,Consulting }) => {
  Awaiting.forEach(id => {
    let mUrl = SHEET_URL + '?action=s02&head=false&no='
    if(bookings.value.hasOwnProperty(id)) return true;
    fetch(mUrl + id).then(resp => resp.json()).then(({ booking:bArray }) => {
      if(bArray[0]) bookings.value[bArray[0]] = zipObj(misc.head,bArray)
    })
  })
  Cancelled.forEach(id => {
    if(bookings.value.hasOwnProperty(id))
      bookings.value[id].Status = 'Cancelled'
  })
  if(parseInt(Consulting) > 0 && bookings.value.hasOwnProperty(Consulting)) bookings.value[Consulting].Status = 'Consulting'
  Completed.forEach(id => {
    if(bookings.value.hasOwnProperty(id))
      bookings.value[id].Status = 'Completed'
  })
},{ deep:true })

watch(() => DOCState.value?.times,times => {
  for (const key in times) {
    let id = parseInt(key.slice(1,-1)) || 0;
    if(id) {
      let lastUpdated = new Date(times[key].seconds*1000).getTime()
      if(lastUpdated < (new Date().getTime() - 3*60*1000)){
        if(!misc.offline.includes(id)) misc.offline.push(id);
        if(misc.online.indexOf(id) > -1) misc.online.splice(misc.online.indexOf(id),1)
      } else {
        if(!misc.online.includes(id)) misc.online.push(id);
        if(misc.offline.indexOf(id) > -1) misc.offline.splice(misc.offline.indexOf(id),1)
      }
    }
  }
},{ deep:true })
function cancelled(booking){
  const bObj = zipObj(misc.head,booking);
  bookings.value[bObj.No] = bObj;
  misc.cancelling = null;
}


async function synchronize(){
  const updates = { Awaiting:[],Cancelled:[],Completed:[],Consulting:0 }
  Object.values(bookings.value).forEach(booking => {
    if(booking.Status === 'Consulting') updates.Consulting = parseInt(booking.No)
    else updates[booking.Status].push(parseInt(booking.No))
  })
  SET_BOOKINGS(updates).then(() => {
    setTimeout(getFromSheet,0.5*60*60*1000)
    misc.loading = false; misc.synced = true;
  })
}

function getFromSheet(){
  const url = SHEET_URL + '?action=lf8&head=' + (!misc.head)
  fetch(url).then(resp => resp.json()).then(resp => {
    if(!misc.head) misc.head = resp.head;
    resp.bookings.forEach(booking => bookings.value[booking[0]] = zipObj(misc.head,booking))
    synchronize()
  })
}

onMounted(getFromSheet)
</script>
