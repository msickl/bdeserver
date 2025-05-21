<template>
    <div class="statusbar">
      <div class="connection-dot" :class="{ connected: isConnected, disconnected: !isConnected  }"></div>
      <small>J. Zimmer Maschinenbau GmbH</small>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useWebSocketStore } from '../stores/websocket';

const store = useWebSocketStore();
let isConnected = ref(false);

watch(() => store.connected, (newVal) => {
    isConnected.value = newVal;
});
</script>

<style>

.connection-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.connected {
  background-color: lightgreen; 
}
.disconnected {
  background-color: red; 
}

.statusbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #6c757d;
  color: white;
  padding: 5px;
  z-index: 1000;
  text-align: center;
}
</style>