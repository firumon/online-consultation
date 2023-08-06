<template>
  <q-card>
    <q-card-section class="text-bold">
      {{ content.booking_head }}
      <q-card-section class="text-body1 q-pa-none q-ma-none" v-html="content.booking_body" />
    </q-card-section>
    <q-separator />
    <q-card-section class="q-gutter-y-sm">
      <q-input label="പേര്" v-model="patient.name" outlined />
      <q-input label="ഫോൺ നമ്പർ (വാട്സ്ആപ്പ് ഉള്ള നമ്പർ)" v-model.number="patient.phone" outlined type="number" />
      <q-btn class="full-width block" label="ബുക്ക് ചെയൂ..." color="primary" padding="md" @click="Book" :disable="!patient.name || !patient.phone" />
    </q-card-section>
    <q-inner-loading :showing="misc.loading" color="warning" label="ബുക്ക് ചെയ്തു കൊണ്ടിരിക്കുകയാണ്.." size="5rem" class="text-warning text-bold" />
  </q-card>
</template>

<script setup>
import {reactive} from "vue";
import {SHEET_URL} from "assets/constants";

const emits = defineEmits(['booked'])
const props = defineProps(['content'])

const patient = reactive({ action:'8sd',name:'',phone:null })
const misc = reactive({ loading:false })
function Book(){
  misc.loading = true; let params = new URLSearchParams(patient).toString(), url = `${SHEET_URL}?${params}`;
  fetch(url).then(resp => resp.json()).then(({ booking,head }) => {
    let b_patient = ({}); for (let idx in head) b_patient[head[idx]] = booking[idx];
    emits('booked',b_patient)
    misc.loading = false;
  })
}
</script>
