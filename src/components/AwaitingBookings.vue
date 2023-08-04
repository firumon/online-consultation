<template>
  <q-card class="full-width">
    <q-card-section class="text-h5 text-bold text-warning bg-white flex justify-between items-center">
      <div>Awaiting</div><div>{{ Awaiting.length }}</div>
    </q-card-section>
    <q-card-section class="q-gutter-y-sm q-pa-sm bg-primary" v-if="Awaiting.length > 0">
      <AwaitingPatient v-for="booking in Awaiting" :booking="booking" :Consulting="Consulting" @cancel="$emit('cancelling',booking)" @consult="misc.consult = $event" :online="online" :live="live.indexOf(booking.No) > -1" />
    </q-card-section>
    <q-card-section v-else class="text-center text-bold bg-grey-2">No any bookings..</q-card-section>
    <q-dialog v-model="consult" persistent full-width><ConsultConfirm v-bind="misc.consult" @consulting="consulting" /></q-dialog>
    <q-inner-loading :showing="misc.loading" size="xl" color="warning" />
  </q-card>
</template>

<script setup>
import {computed, reactive} from "vue";
import {zipObj} from "assets/constants";
import AwaitingPatient from "components/AwaitingPatient.vue";
import ConsultConfirm from "components/ConsultConfirm.vue";

const props = defineProps(['bookings','head','online','live'])
const emits = defineEmits(['updates','cancelling'])

const misc = reactive({ loading:false,cancelling:null,consult:null })

const Awaiting = computed(() => Object.values(props.bookings).filter(booking => booking.Status === 'Awaiting'))
const Completed = computed(() => Object.values(props.bookings).filter(booking => booking.Status === 'Completed'))
const Cancelled = computed(() => Object.values(props.bookings).filter(booking => booking.Status === 'Cancelled'))
const Consulting = computed(() => Object.values(props.bookings).find(booking => booking.Status === 'Consulting'))

const consult = computed({
  get(){ return misc.consult !== null },
  set(){ return misc.consult = null }
})
function consulting(){
  misc.consult = null;
}
</script>
