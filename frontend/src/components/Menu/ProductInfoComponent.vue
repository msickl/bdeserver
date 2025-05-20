<template>
  <h3>Produktinformation</h3>
  <div v-if="data?.id" class="value">
    <label class="label-small-gray">Artikelnummer</label>
    <div>{{ data.id }}</div>
  </div>

  <div v-if="data?.var1" class="value">
    <label class="label-small-gray">Bezeichnung 1</label>
    <div style="font-weight: bold;">{{ data.var1 }}</div>
  </div>

  <div v-if="data?.var2" class="value">
    <label class="label-small-gray">Bezeichnung 2</label>
    <div>{{ data.var2 }}</div>
  </div>

  <div v-if="data?.var3" class="value">
    <label class="label-small-gray">Bezeichnung 3</label>
    <div>{{ data.var3 }}</div>
  </div>

  <div v-if="data?.material" class="value">
    <label class="label-small-gray">Werkstoff</label>
    <div>{{ data.material }}</div>
  </div>

  <div v-if="data?.standard" class="value">
    <label class="label-small-gray">Norm</label>
    <div>{{ data.standard }}</div>
  </div>

  <div v-if="data?.unit" class="value">
    <label class="label-small-gray">Grundeinheit</label>
    <div>{{ data.unit }}</div>
  </div>

  <div v-if="data?.unitdesc" class="value">
    <label class="label-small-gray">Einheit</label>
    <div>{{ data.unitdesc }}</div> 
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>
