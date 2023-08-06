<template>
  <q-page class="q-gutter-y-md" padding>
    <div class="text-h5 text-bold q-mt-lg">
      <div class="text-h4 text-bold">{{ content.intro }} <span v-if="patient_data.Name">{{ patient_data.Name }}</span></div>{{ content.welcome }}
      <div class="text-body1">{{ content.body }}</div>
    </div>
    <DoctorStatus :patient="patient" :status="status" :content="content" />
    <PatientBook v-if="!patient" @booked="setPatient" :content="content" />
    <PatientStatus v-else :No="patient" :Details="patient_data" :Status="status" :content="content" @book="resetBooking" @cancel="resetBooking" />
  </q-page>
</template>

<script setup>
import DoctorStatus from "components/DoctorStatus.vue";
import PatientBook from "components/PatientBook.vue";
import PatientStatus from "components/PatientStatus.vue";

import {computed, reactive, ref} from "vue";
import {DO_BOOK, PATIENT_ONLINE} from "assets/booking";
import {LS_Details, LS_Number} from "assets/constants";
import {useDocument} from "vuefire";
import {ROCRef} from "boot/firebase";

const status = useDocument(ROCRef)

const content = computed(() => status.value?.contents || ({}))
const patient = ref(0);
const patient_data = reactive({ No:null,Name:null,Phone:null,Status:null });

function getPatientFromStorage(){
  patient.value = parseInt(localStorage.getItem(LS_Number)) || 0
  if(patient.value > 0){
    let details = JSON.parse(localStorage.getItem(LS_Details));
    for (let key in details) {
      patient_data[key] = details[key]
    }
    setInterval(No => status.value.Awaiting.includes(parseInt(No)) ? PATIENT_ONLINE(No) : null,30000,patient.value)
  }
}

getPatientFromStorage();

function setPatient(details){
  DO_BOOK(details).then(() => {
    for (let key in patient_data) { patient_data[key] = details[key]; }
    patient_data.No = parseInt(patient_data.No);
    localStorage.setItem(LS_Details,JSON.stringify(details));
    localStorage.setItem(LS_Number,patient_data.No);
    getPatientFromStorage();
  })
}

function resetBooking(){
  localStorage.removeItem(LS_Number);
  patient.value = 0;
}
</script>
