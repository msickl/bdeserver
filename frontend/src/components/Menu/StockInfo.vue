<template>
  <div>
    <div v-if="stock.name" class="value">
      <label class="label-small-gray">Hauptlager</label>
      <div>{{ stock.name }}</div>
    </div>
    <div v-if="stock.locationname" class="value">
      <label class="label-small-gray">Lagerort</label>
      <div>{{ stock.locationname }}</div>
    </div>
    <div class="mb-3">
      <label class="label-small-gray">Buchungsart</label>
      <select class="form-select custom-select" v-model="stock.operationtype">
        <option value="1">Abbuchung</option>
        <option value="2">Rückbuchung</option>
        <option value="3">Inventur</option>
        <option value="4">Verschrottung</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stock: Object
});
</script>
