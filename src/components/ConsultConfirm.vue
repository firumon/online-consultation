<template>
  <q-card>
    <q-card-section class="bg-grey-2 flex justify-between items-center">
      <div class="text-warning text-bold text-h6">Confirm Consultation</div>
      <q-btn v-close-popup icon="close" color="warning" push glossy round dense />
    </q-card-section>
    <q-card-section>{{ Name }}, ബുക്കിങ് നമ്പർ: {{ No }} യുമായുള്ള കൺസൾറ്റേഷൻ തുടങ്ങാൻ പോകുകയാണ്. ഉറപ്പായങ്കിൽ പച്ച ബട്ടൺ അമർത്തുക. അല്ലെങ്കിൽ ഈ മെസ്സേജ് ക്ലോസ് ചെയ്യുക..</q-card-section>
    <q-card-actions class="bg-grey-1" align="right">
      <q-btn label="തുടങ്ങുക" color="positive" padding="md" @click="consulting" />
    </q-card-actions>
    <q-inner-loading :showing="misc.loading" color="warning" size="xl" class="text-bold" label="Starting, Please wait...." />
  </q-card>
</template>

<script setup>
import {SHEET_URL} from "assets/constants";
import {CONSULT_FROM_AWAITING} from "assets/booking";
import {reactive} from "vue";

const props = defineProps(['No','Name'])
const emits = defineEmits(['consulting'])

const misc = reactive({ loading:false })
function consulting(){
  misc.loading = true;
  const url = SHEET_URL + '?action=9df&no=' + props.No;
  fetch(url).then(resp => resp.json()).then(({ booking }) => {
    CONSULT_FROM_AWAITING(props.No).then(() => {
      misc.loading = false;
      emits('consulting',booking);
    })
  })
}
</script>
