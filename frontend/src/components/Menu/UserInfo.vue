<template>
  <div v-if="user.employeeId" class="value">
    <label class="label-small-gray">Personalnummer</label>
    <div style="font-weight: bold;">{{ user.employeeId }}</div>
  </div>
  <div v-if="user.employeeId" class="value">
    <label class="label-small-gray">Name</label>
    <div>{{ user.lastName }} {{ user.firstName }}</div>
  </div>
</template>

<script setup>
defineProps({
  user: Object
});
</script>
