<template>
  <q-card>
    <q-card-section class="flex items-center justify-between no-wrap">
      <div class="text-bold text-primary">ഡോക്ടർ ഇപ്പോൾ {{ status.status }} സ്റ്റാറ്റസ് ആണ്</div>
      <div><q-spinner-puff size="md" color="positive" /></div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import {useDocument} from "vuefire";
import {ROCRef} from "boot/firebase";

const status = useDocument(ROCRef)
</script>
