<template>
  <div v-if="store.user.employeeId" class="value">
    <label class="label-small-gray">Personalnummer</label>
    <div style="font-weight: bold;">{{ store.user.employeeId }}</div>
  </div>
  <div v-if="store.user.employeeId" class="value">
    <label class="label-small-gray">Name</label>
    <div>{{ store.user.lastName }} {{ store.user.firstName }}</div>
  </div>
</template>

<script setup>
import { useCredentialStore } from '@/stores/useCredentialStore';
const store = useCredentialStore();
</script>
