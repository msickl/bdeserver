<template>
  <div class="topbar">
    <font-awesome-icon :icon="userIcon" :style="iconStyle" />
    <font-awesome-icon :icon="batteryIcon" />
    <font-awesome-icon :icon="wifiIcon" :style="wifiStyle" />

    <div class="beacon-button" @click="menu.toggleSidebar">
      <svg viewBox="0 0 100 100" width="40" height="40">
        <path
          class="line top"
          :class="{ active: menu.isSidebarEnabled }"
          d="M 20,29 H 80"
        />
        <path
          class="line middle"
          :class="{ active: menu.isSidebarEnabled }"
          d="M 20,50 H 80"
        />
        <path
          class="line bottom"
          :class="{ active: menu.isSidebarEnabled }"
          d="M 20,71 H 80"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { faBatteryFull, faBatteryThreeQuarters, faBatteryHalf, faBatteryEmpty, faWifi, faUserLarge, faUserLargeSlash } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useWebSocketStore } from '../stores/websocket';
import { useCredentialStore } from '../stores/useCredentialStore';
import { useMenuStore } from '../stores/useMenuStore';

library.add(faBatteryFull, faBatteryThreeQuarters, faBatteryHalf, faBatteryEmpty, faWifi, faUserLarge, faUserLargeSlash);

const store = useWebSocketStore();
const creds = useCredentialStore();
const menu = useMenuStore();

const batteryInfo = ref(0);
const wlanInfo = ref(0);

const batteryIcon = computed(() => {
  if (batteryInfo.value >= 75) {
    return ['fas', 'battery-full'];
  } else if (batteryInfo.value >= 50) {
    return ['fas', 'battery-three-quarters'];
  } else if (batteryInfo.value >= 25) {
    return ['fas', 'battery-half'];
  } else {
    return ['fas', 'battery-empty'];
  }
});

const wifiIcon = computed(() => {
  return ['fas', 'wifi'];
});

const wifiStyle = computed(() => {
  
  let color;
  if (wlanInfo.value >= 75) {
    color = 'green'; 
  } else if (wlanInfo.value >= 50) {
    color = 'yellow'; 
  } else if (wlanInfo.value >= 25) {
    color = 'white'; 
  } else {
    color = 'red'; 
  }

  return {
    color: color
  };
});

const userIcon = computed(() => {
  if(creds.isLoggedIn)
  {
    return ['fas', 'user-large'];
  } else {
    return ['fas', 'user-large-slash'];
  }
});

const iconStyle = computed(() => {
  return {
    color: creds.isLoggedIn ? 'lightgreen' : 'red'
  };
});

onMounted(() => {
  store.onMessage = (message) => {
    try {
      if (message.Action === 'deviceInfo') {
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
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #2d2d2d;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: #fff;
}

.icon {
  margin: 0 10px;
}

.beacon-button {
  cursor: pointer;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease;
}

.beacon-button svg {
  fill: none;
  stroke: #fff;
  stroke-width: 5;
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

.fas {
  font-size: 18px;
  transition: color 0.3s ease;
}

.fas.fa-battery-full {
  color: #4caf50;
}

.fas.fa-battery-three-quarters {
  color: #ff9800;
}

.fas.fa-battery-half {
  color: #ff5722;
}

.fas.fa-battery-empty {
  color: #f44336;
}

.fas.fa-wifi {
  color: #4caf50;
}

.fas.fa-wifi-bars {
  color: #2196f3;
}

.fas.fa-wifi-bars-1 {
  color: #ff9800;
}

.fas.fa-wifi-slash {
  color: #f44336;
}
</style>
