<template>
  <q-card>
    <q-card-section class="flex items-center justify-between no-wrap">
      <div class="text-bold text-center" :class="'text-'+color">ഡോക്ടർ ഇപ്പോൾ {{ status?.status }} ആണ്<span v-if="online && status.Consulting">, patient no: {{ status.Consulting }} നെ പരിശോധിച്ചു കൊണ്ടിരിക്കുകയാണ്..</span></div>
    </q-card-section>
    <template v-if="status?.Awaiting.length">
      <q-separator inset />
      <q-card-section v-if="status.Awaiting.length === 1">
        <span v-if="status.Consulting > 0">ഒരാളും കൂടെ ഡോക്ടറെ കാണാൻ വെയിറ്റ് ചെയ്തുകൊണ്ടിരിക്കുന്നു</span>
        <span v-else>ഒരാൾ ബുക് ചെയ്തു ഡോക്ടറെ കാണാൻ കാത്തിരിക്കുന്നുണ്ട്</span>
      </q-card-section>
      <q-card-section v-if="status.Awaiting.length === 2">
        <span v-if="status.Consulting > 0">രണ്ടാളുകൾ കൂടി ഡോക്ടറെ കാണാൻ വെയിറ്റ് ചെയ്തുകൊണ്ടിരിക്കുന്നു</span>
        <span v-else>രണ്ടാളുകൾ ബുക് ചെയ്തു ഡോക്ടറെ കാണാൻ കാത്തിരിക്കുന്നുണ്ട്</span>
      </q-card-section>
      <q-card-section v-if="status.Awaiting.length > 2">
        <span v-if="status.Consulting > 0">{{ status.Awaiting.length }} ആളുകൾ കൂടി ഡോക്ടറെ കാണാൻ വെയിറ്റ് ചെയ്തുകൊണ്ടിരിക്കുന്നു</span>
        <span v-else>{{ status.Awaiting.length }} ആളുകൾ ബുക് ചെയ്തു ഡോക്ടറെ കാണാൻ കാത്തിരിക്കുന്നുണ്ട്</span>
      </q-card-section>
    </template>
  </q-card>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps(['patient','status'])
const color = computed(() => props.status?.status === 'Online' ? 'positive' : 'warning')
const online = computed(() => props.status?.status === 'Online')
const offline = computed(() => props.status?.status === 'Offline')
</script>
