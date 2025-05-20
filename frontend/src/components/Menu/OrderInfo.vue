<template>
  <div>
    <div v-if="order" class="value">
      <div v-if="order" class="value">
        <label class="label-small-gray">Auftrag</label>
        <div>{{ order.VORGNR }}</div>
      </div>
      <div v-if="order" class="value">
        <label class="label-small-gray">Name</label>
        <div>{{ order.NAME1 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  order: Object
});

</script>
