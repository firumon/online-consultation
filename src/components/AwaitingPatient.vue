<template>
  <q-card>
    <q-card-section class="text-bold q-px-none">
      <q-card-section class="q-py-xs flex justify-between"><div><q-spinner-puff color="positive" v-if="live" /> {{ booking.Name }}</div><div>{{ booking.No }}</div></q-card-section>
      <q-card-section class="q-py-xs flex justify-between">
        <div>{{ booking.Phone }} <br> <span class="text-body2">{{ formatDate(booking.Date,'ddd DD/MM, hh:mm a') }}<br><span :key="misc.since">{{ tDiff(booking.Date) }} Mins</span></span></div>
        <div><q-btn icon="forward" color="positive" dense rounded padding="sm" size="sm" target="_blank" :href="href" /></div>
      </q-card-section>
    </q-card-section>
    <q-card-actions align="between" class="bg-grey-2">
      <q-btn label="ക്യാൻസൽ" color="negative" @click="emits('cancel',booking)" :disable="!online" />
      <q-btn label="കൺസൾട്" color="warning"  @click="emits('consult',booking)" v-if="!Consulting" :disable="!online" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import {computed, reactive} from "vue";
import {date} from "quasar";
const { formatDate,getDateDiff } = date

const props = defineProps(['booking','Consulting','online','live'])
const emits = defineEmits(['cancel','consult'])

const misc = reactive({ since:0 })

const href = computed(() => props.booking?.Phone ? ('https://api.whatsapp.com/send?phone='+(String(props.booking.Phone).length === 10 ? ("91"+props.booking.Phone) : props.booking.Phone)+'&text='+encodeURI("Hi, "+props.booking.Name+"..")) : null)
function tDiff(date){ return parseFloat(getDateDiff(new Date(),date,'seconds')/60).toFixed(2).replace(".",":") }
setInterval(() => misc.since++,3000)
</script>
