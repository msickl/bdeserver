<template>
<div>
  <div v-for="item in items" :key="item.id">
    <div class="value">
      <label class="label-small-gray">Artikelnummer</label>
      <div>{{ item.id }}</div>
    </div>
    <div v-if="item.var1" class="value">
      <label class="label-small-gray">Bezeichnung 1</label>
      <div>{{ item.var1 }}</div>
    </div>
    <div v-if="item.var2" class="value">
      <label class="label-small-gray">Bezeichnung 2</label>
      <div>{{ item.var2 }}</div>
    </div>
    <div>
      <label class="label-small-gray">Anzahl</label>
      <div class="input-group">
        <input
          type="number"
          id="quantity"
          class="form-control text-center"
          v-model="item.count"
          min="0"
          :max="item.count"
        />
        <button @click="handleRemoveItem(item.id)" class="btn btn-danger">-</button>
        <button @click="handleAddItem(item.id)" class="btn btn-success">+</button>
      </div>
    </div>
    <div v-if="item.serialrequired">
      <div v-for="serial in item.serials" :key="serial.guid" class="serial-item">
        <div class="input-group">
          <div class="value">
            <label class="label-small-gray">{{ serial.type }}</label>
            <div class="serial-number">{{ serial.number }}</div>
          </div>
          <button @click="handleRemoveSerial(item.id, serial.guid)" class="btn btn-danger remove-btn">-</button>
        </div>
      </div>
      <button v-if="item.count > item.serials.length" @click="handleAddSerial(item.id)" class="btn btn-success add-btn">Add Serial</button>
    </div>
  </div>
</div>
</template>

<script setup>
defineProps({
  items: Array
});

const emit = defineEmits(['addItem', 'removeItem', 'addSerial', 'removeSerial']);

function handleAddItem(id) {
  emit('addItem', id);
}

function handleRemoveItem(id) {
  emit('removeItem', id);
}

function handleAddSerial(id) {
  emit('addSerial', id);
}

function handleRemoveSerial(itemId, serialGuid) {
  emit('removeSerial', itemId, serialGuid);
}
</script>

<style scoped>
.serial-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-top:7px;
}

.input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value {
  flex-grow: 1;
}

.label-small-gray {
  color: #777;
}

.serial-number {
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 5px;
}

.remove-btn {
  padding: 6px 12px;
  font-size: 1.1rem;
  border-radius: 5px;
  background-color: #dc3545;
  color: white;
}

.remove-btn:hover {
  background-color: #c82333;
}

.add-btn {
  width: 100%;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 15px;
}

.add-btn:hover {
  background-color: #218838;
}
</style>