<template>
  <q-card>
    <q-card-section class="bg-grey-2 flex justify-between items-center">
      <div class="text-warning text-bold text-h6">Cancel Booking</div>
      <q-btn v-close-popup icon="close" color="warning" push glossy round dense />
    </q-card-section>
    <q-card-section>ബുക്കിങ് നമ്പർ: {{ No }} ({{ Name }}) ക്യാൻസൽ ചെയ്യാൻ ശ്രമിക്കുന്നു. ഉറപ്പായും ക്യാൻസൽ ചെയ്യണമെങ്കിൽ, ചുവപ്പ് ബട്ടൺ അമർത്തിക്കൊള്ളുക .. അല്ലെങ്കിൽ ഈ മെസ്സേജ് ക്ലോസ് ചെയ്യുക..</q-card-section>
    <q-card-actions class="bg-grey-1" align="right">
      <q-btn label="ക്യാൻസൽ ചെയ്യൂ" color="negative" padding="md" @click="cancel" />
    </q-card-actions>
    <q-inner-loading :showing="misc.loading" color="warning" size="xl" class="text-bold" label="Cancelling, Please wait...." />
  </q-card>
</template>

<script setup>
import {SHEET_URL} from "assets/constants";
import {CANCEL_BOOKING} from "assets/booking";
import {reactive} from "vue";

const props = defineProps(['No','Name'])

const emits = defineEmits(['cancelled'])
const misc = reactive({ loading:false })
function cancel(){
  misc.loading = true;
  const url = SHEET_URL + '?action=ld7&no=' + props.No;
  fetch(url).then(resp => resp.json()).then(({ booking }) => {
    CANCEL_BOOKING(props.No).then(() => {
      misc.loading = false;
      emits('cancelled',booking);
    })
  })
}
</script>
