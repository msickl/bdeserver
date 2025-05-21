<template>
  <div class="topbar">
    <span>Battery {{ batteryInfo }}%</span><span>Wifi {{ wlanInfo }} dB</span>
    <div class="beacon-button" @click="handleToggleSidebar">
      <svg viewBox="0 0 100 100" width="40" height="40">
        <path class="line top" :class="{ active: showSidebar }" d="M 20,29 H 80" />
        <path class="line middle" :class="{ active: showSidebar }" d="M 20,50 H 80" />
        <path class="line bottom" :class="{ active: showSidebar }" d="M 20,71 H 80" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWebSocketStore } from '../stores/websocket';

const store = useWebSocketStore();

const props = defineProps({
  showSidebar: Boolean
});

const emit = defineEmits(['toggleSidebar']);

const handleToggleSidebar = () => {
  emit('toggleSidebar'); 
};

const batteryInfo = ref(0);
const wlanInfo = ref(0);

onMounted(() => {
  store.onMessage = (message) => {
    try {
      if(message.Action === 'deviceInfo')
      {
        batteryInfo.value = message.Data.battery;
        wlanInfo.value = message.Data.wlan;
      }
    } catch {}
  };
});
</script>


<style scoped>
.topbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  background-color: #333;
}

.beacon-button {
  cursor: pointer;
  padding: 10px;
  transition: transform 0.3s ease-in-out;
}

.beacon-button svg {
  fill: none;
  stroke: #fff;
  stroke-width: 4;
}

.line {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.line.top {
  transform-origin: center;
}

.line.middle {
  transition: opacity 0.3s ease-in-out;
}

.line.bottom {
  transform-origin: center;
}

.line.active.top {
  transform: rotate(45deg) translate(7px, 7px);
}

.line.active.middle {
  opacity: 0;
}

.line.active.bottom {
  transform: rotate(-45deg) translate(7px, -7px);
}
</style>
