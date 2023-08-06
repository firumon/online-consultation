<template>
  <q-layout view="lHh Lpr lFf" style="background: url('background.jpg') top left no-repeat fixed; background-size: cover;">
    <q-header elevated >
      <q-toolbar>
        <q-toolbar-title>Dr. Portal {{ version }}</q-toolbar-title>
        <q-toggle :label="status" color="green" false-value="Offline" true-value="Online" v-model="status" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {computed, provide} from "vue";
import {ROCRef} from "boot/firebase";
import {useDocument} from "vuefire";
import {DOCTOR_STATUS} from "assets/booking";
import { version } from './../../package.json'

const DOCState = useDocument(ROCRef)
provide('DOCState',DOCState)

const status = computed({
  get(){ return DOCState.value?.status },
  set(n_status){ DOCTOR_STATUS(n_status) }
})
</script>
