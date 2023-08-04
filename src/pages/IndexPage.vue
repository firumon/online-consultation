<template>
  <q-page class="q-gutter-y-md" padding>
    <div class="text-h5 text-bold q-mt-lg">
      <div class="text-h4 text-bold">ഹായ്.. <span v-if="patient_data.Name">{{ patient_data.Name }}</span></div>Rafshi ഡോക്ടറുടെ online consultation സംവിധാനത്തിലേക്ക് സ്വാഗതം
      <div class="text-body1">വീട്ടിൽ ഇരുന്നുകൊണ്ട് തന്നെ റഫ്ഷി ഡോക്ടറുടെ പരിചരണം നിങ്ങൾക്ക് ലഭ്യമാക്കുന്നു..</div>
    </div>
    <DoctorStatus :patient="patient" :status="status" />
    <PatientBook v-if="!patient" @booked="setPatient" />
    <PatientStatus v-else :No="patient" :Details="patient_data" :Status="status" @book="resetBooking" @cancel="resetBooking" />
  </q-page>
</template>

<script setup>
import DoctorStatus from "components/DoctorStatus.vue";
import PatientBook from "components/PatientBook.vue";
import PatientStatus from "components/PatientStatus.vue";

import {inject, reactive, ref} from "vue";
import {DO_BOOK, PATIENT_ONLINE} from "assets/booking";
import {LS_Details, LS_Number} from "assets/constants";
import {useDocument} from "vuefire";
import {ROCRef} from "boot/firebase";

const status = useDocument(ROCRef)

const patient = ref(0);
const patient_data = reactive({ No:null,Name:null,Phone:null,Status:null });

function getPatientFromStorage(){
  patient.value = parseInt(localStorage.getItem(LS_Number)) || 0
  if(patient.value > 0){
    let details = JSON.parse(localStorage.getItem(LS_Details));
    for (let key in details) {
      patient_data[key] = details[key]
    }
    setInterval(No => status.Awaiting.includes(parseInt(No)) ? PATIENT_ONLINE(No) : null,30000,patient.value)
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
