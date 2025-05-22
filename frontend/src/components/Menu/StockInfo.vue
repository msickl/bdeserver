<template>
  <div>
    <div v-if="store.stock.name" class="value">
      <label class="label-small-gray">Hauptlager</label>
      <div>{{ store.stock.name }}</div>
    </div>
    <div v-if="store.stock.locationname" class="value">
      <label class="label-small-gray">Lagerort</label>
      <div>{{ store.stock.locationname }}</div>
    </div>
    <div class="mb-3">
      <label class="label-small-gray">Buchungsart</label>
      <select class="form-select custom-select" v-model="store.stock.operationtype">
        <option value="1">Abbuchung</option>
        <option value="2">Rückbuchung</option>
        <option value="3">Inventur</option>
        <option value="4">Verschrottung</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { useCredentialStore } from '../../stores/useCredentialStore';
const store = useCredentialStore();
</script>
