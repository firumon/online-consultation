<template>
  <q-card class="text-center">
    <q-card-section class="text-bold text-h6">നിങ്ങളുടെ ടോക്കൺ: {{ No }}</q-card-section>
    <q-separator inset />
    <template v-if="cancelled">
      <q-card-section class="text-bold text-h6 text-red" style="line-height: 1.2rem">{{ content.cancel_info }}</q-card-section>
      <q-card-actions class="bg-grey-2"><q-btn label="വീണ്ടും ബുക്ക് ചെയ്യുക" color="primary" padding="md" class="block full-width" @click="emits('book')" /></q-card-actions>
    </template>
    <template v-else-if="queue > 0">
      <q-card-section v-if="queue === 1" class="text-bold text-h6 text-red" style="line-height: 1.2rem">{{ content.next_patient_info }}</q-card-section>
      <q-card-section v-if="queue === 2" class="text-bold text-h6 text-warning" style="line-height: 1.2rem">{{ content.next_after_next_patient_info }}</q-card-section>
      <q-card-section v-if="queue === 3" class="text-bold text-h6" style="line-height: 1.2rem">{{ content.next_after_two_patient_info }}</q-card-section>
      <q-card-section v-if="queue > 3" class="text-bold text-h6 text-red" style="line-height: 1.2rem">{{ queue-1 }} {{ content.next_after_patients_info }}</q-card-section>
      <q-separator inset />
      <q-card-section>
        <q-btn label="ബുക്കിങ് ക്യാൻസൽ ചെയ്യുക..." color="warning" padding="md" class="block full-width" @click="misc.cancel = true" />
      </q-card-section>
    </template>
    <template v-else-if="consulting">
      <q-card-section class="text-positive">{{ content.consulting_you }}</q-card-section>
    </template>
    <template v-else>
      <q-card-section class="text-bold text-h5 text-positive">
        {{ content.consulting_completed }}<br><br>
        <span class="text-caption" style="font-size: 1.1rem">{{ content.thanking }}</span>
        <q-btn label="വീണ്ടും ബുക്ക് ചെയ്യുക" color="primary" padding="md" class="block full-width" @click="emits('book')" />
      </q-card-section>
    </template>
    <q-dialog v-model="misc.cancel" full-width persistent>
      <q-card>
        <q-card-section class="text-bold text-h5 text-warning">{{ content.cancel_confirm_title }}</q-card-section>
        <q-separator />
        <q-card-section v-html="content.cancel_confirm" />
        <q-card-actions align="between" class="bg-grey-2 no-wrap q-py-md">
          <q-btn label="ക്യാൻസൽ ചെയ്യേണ്ടതില്ല" color="positive" v-close-popup no-wrap />
          <q-btn label="ക്യാൻസൽ ചെയ്യൂ.." color="negative" @click="cancelBooking" no-wrap />
        </q-card-actions>
        <q-inner-loading :showing="misc.cancelling" size="xl" label="ക്യാൻസൽ ചെയ്തുകൊണ്ടിരിക്കുകയാണ്... ഒന്ന് വെയിറ്റ് ചെയ്യൂ.." color="warning" />
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import {computed, reactive} from "vue";
import {LS_Number, SHEET_URL} from "assets/constants";
import {CANCEL_BOOKING} from "assets/booking";

const props = defineProps(['No','Details','Status','content'])
const emits = defineEmits(['book','cancel'])

const misc = reactive({ cancel:false,cancelling:false })
const Awaiting = computed(() => (props.Status?.Awaiting || []).map(No => parseInt(No)))
const Cancelled = computed(() => (props.Status?.Cancelled || []).map(No => parseInt(No)))
const Consulting = computed(() => parseInt(props.Status?.Consulting || 0))
const consulting = computed(() => props.No === Consulting.value)
const queue = computed(() => Awaiting.value.indexOf(props.No)+1)
const cancelled = computed(() => Cancelled.value.indexOf(props.No) > -1)

function cancelBooking(){
  misc.cancelling = true;
  const url = SHEET_URL + '?action=ld7&no=' + props.No;
  fetch(url).then(resp => resp.json()).then(({ booking }) => {
    CANCEL_BOOKING(props.No).then(() => {
      misc.cancelling = true;
      emits('cancel');
    })
  })
}

</script>
