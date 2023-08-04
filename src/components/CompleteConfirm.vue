<template>
  <q-card>
    <q-card-section class="bg-grey-2 flex justify-between items-center">
      <div class="text-positive text-bold text-h6">Complete Consultation</div>
      <q-btn v-close-popup icon="close" color="warning" push glossy round dense />
    </q-card-section>
    <q-card-section>{{ Name }}, ബുക്കിങ് നമ്പർ: {{ No }} യുമായുള്ള കൺസൾറ്റേഷൻ അവസാനിക്കുകയാണ്. ഉറപ്പായങ്കിൽ പച്ച ബട്ടൺ അമർത്തുക. അല്ലെങ്കിൽ ഈ മെസ്സേജ് ക്ലോസ് ചെയ്യുക..</q-card-section>
    <q-card-actions class="bg-grey-1" align="right">
      <q-btn label="അവസാനിപ്പിക്കുക" color="positive" padding="md" @click="Complete" />
    </q-card-actions>
    <q-inner-loading :showing="misc.loading" color="warning" size="xl" class="text-bold" label="Completing, Please wait...." />
  </q-card>
</template>

<script setup>
import {SHEET_URL} from "assets/constants";
import {CONSULTING_COMPLETED} from "assets/booking";
import {reactive} from "vue";

const props = defineProps(['No','Name'])
const emits = defineEmits(['completed'])

const misc = reactive({ loading:false })
function Complete(){
  misc.loading = true;
  const url = SHEET_URL + '?action=ef4&no=' + props.No;
  fetch(url).then(resp => resp.json()).then(({ booking }) => {
    if(booking[0]) CONSULTING_COMPLETED(booking[0]).then(() => {
      misc.loading = false;
      emits('completed',booking);
    }); else misc.loading = false;
  })
}
</script>
