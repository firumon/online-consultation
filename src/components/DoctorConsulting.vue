<template>
  <q-card class="full-width" v-if="bookings[consulting] && patient.No">
    <q-card-section class="text-h5 text-bold text-primary bg-grey-2 flex justify-between items-center">
      <div>Consulting <div class="text-caption">{{ rFormat(patient.Date) }}</div></div>
      <div>{{ patient.No }}</div>
    </q-card-section>
    <q-card-section class="flex justify-between items-center">
      <div>
        <div class="text-bold text-h5">{{ patient.Name }}</div>
        <div class="text-bold flex justify-between items-center">{{ patient.Phone }}</div>
      </div>
      <div><q-btn icon="forward" color="positive" dense rounded padding="sm" size="lg" target="_blank" :href="href" /></div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="flex justify-between items-center"><div>Started</div><div>{{ rFormat(patient.Updated) }}</div></div>
      <div class="flex justify-between items-center"><div>&nbsp;</div><div><span :key="misc.since">{{ tDiff(patient.Updated) }}</span> Minutes <q-spinner-puff color="primary" /></div></div>
    </q-card-section>
    <q-card-actions align="between" class="bg-grey-2">
      <q-btn icon="delete_sweep" color="negative" round padding="md" @click="$emit('cancelling',patient)"/>
      <q-btn label="അവസാനിപ്പിക്കുക" color="primary" padding="md" @click="() => misc.completing = true" />
    </q-card-actions>
    <q-dialog persistent v-model="misc.completing"><CompleteConfirm v-bind="patient" @completed="() => misc.completing = false" /></q-dialog>
  </q-card>
</template>

<script setup>
import {computed, reactive} from "vue";
import {date} from "quasar";
import CompleteConfirm from "components/CompleteConfirm.vue";

const props = defineProps(['consulting','bookings'])
const emits = defineEmits(['cancelling'])
const { formatDate,getDateDiff } = date

const misc = reactive({ loading:true,since:0,completing:false })

const patient = computed(() => props.bookings[props.consulting] || ({}))
const href = computed(() => patient.value?.Phone ? ('https://api.whatsapp.com/send?phone='+(String(patient.value.Phone).length === 10 ? ("91"+patient.value.Phone) : patient.value.Phone)+'&text='+encodeURI("Hi, "+patient.value.Name+"..")) : null)


function rFormat(date){ return formatDate(date,"ddd DD/MM, hh:mm A") }
function tDiff(date){ return parseFloat(getDateDiff(new Date(),date,'seconds')/60).toFixed(2).replace(".",":") }
setInterval(() => misc.since++,5000)
</script>
