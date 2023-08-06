<template>
  <q-card>
    <q-card-section class="flex items-center justify-between no-wrap">
      <div class="text-bold text-center" :class="'text-'+color">ഡോക്ടർ ഇപ്പോൾ {{ status?.status }} ആണ്<span v-if="online && status.Consulting">, patient no: {{ status.Consulting }} നെ പരിശോധിച്ചു കൊണ്ടിരിക്കുകയാണ്..</span></div>
    </q-card-section>
    <template v-if="status?.Awaiting.length">
      <q-separator inset />
      <q-card-section v-if="status.Awaiting.length === 1">
        <span v-if="status.Consulting > 0">{{ content.doctor_consulting_awaiting_one }}</span>
        <span v-else>{{ content.doctor_awaiting_one }}</span>
      </q-card-section>
      <q-card-section v-if="status.Awaiting.length === 2">
        <span v-if="status.Consulting > 0">{{ content.doctor_consulting_awaiting_two }}</span>
        <span v-else>{{ content.doctor_awaiting_two }}</span>
      </q-card-section>
      <q-card-section v-if="status.Awaiting.length > 2">
        <span v-if="status.Consulting > 0">{{ status.Awaiting.length }} {{ content.doctor_consulting_awaiting_more }}</span>
        <span v-else>{{ status.Awaiting.length }} {{ content.doctor_consulting_awaiting_more }}</span>
      </q-card-section>
    </template>
  </q-card>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps(['patient','status','content'])
const color = computed(() => props.status?.status === 'Online' ? 'positive' : 'warning')
const online = computed(() => props.status?.status === 'Online')
const offline = computed(() => props.status?.status === 'Offline')
</script>
