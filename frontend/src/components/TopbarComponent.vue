<template>
  <div class="topbar">
    <font-awesome-icon :icon="userIcon" :style="iconStyle" />
    <img :src="batteryIcon" width="40px" />
    <img :src="wifiIcon" width="40px" height="40px" />
    
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
import { faUserLarge, faUserLargeSlash } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useWebSocketStore } from '@/stores/useWebSocketStore';
import { useCredentialStore } from '@/stores/useCredentialStore';
import { useMenuStore } from '@/stores/useMenuStore';

import WifiNone from '@/assets/wifi/wifi-none.svg?component';  
import WifiFull from '@/assets/wifi/wifi-full.svg?component';
import WifiGood from '@/assets/wifi/wifi-good.svg?component';
import WifiMedium from '@/assets/wifi/wifi-medium.svg?component';
import WifiMinimal from '@/assets/wifi/wifi-minimal.svg?component';

import BatteryEmpty from '@/assets/battery/battery-empty.svg?component';  
import BatteryFull from '@/assets/battery/battery-full.svg?component';
import BatteryOne from '@/assets/battery/battery-one.svg?component';
import BatteryTwo from '@/assets/battery/battery-two.svg?component';

library.add(faUserLarge, faUserLargeSlash);

const store = useWebSocketStore();
const creds = useCredentialStore();
const menu = useMenuStore();

const batteryInfo = ref(0);
const batteryStatus = ref(0);

const wlanSignal = ref(0);

const batteryIcon = computed(() => {
  if (batteryInfo.value >= 75) {
    return BatteryFull;
  } else if (batteryInfo.value >= 50) {
    return BatteryTwo;
  } else if (batteryInfo.value >= 25) {
    return BatteryOne;
  } else {
    return BatteryEmpty;
  }
});

const wifiIcon = computed(() => {
  if (wlanSignal.value >= 75) {
    return WifiFull;
  } else if (wlanSignal.value >= 50) {
    return WifiGood;
  } else if (wlanSignal.value >= 35) {
    return WifiMedium;
  } else if (wlanSignal.value >= 15) {
    return WifiMinimal;
  } else {
    return WifiNone;
  }
});

const wifiStyle = computed(() => {
  
  let color;
  if (wlanSignal.value >= 75) {
    color = 'white'; 
  } else if (wlanSignal.value >= 50) {
    color = 'lightgreen'; 
  } else if (wlanSignal.value >= 25) {
    color = 'yellow'; 
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
        batteryInfo.value = message.Data.battery.EstimatedChargeRemaining;
        batteryStatus.value = message.Data.battery.BatteryStatus;
        wlanSignal.value = message.Data.wlan.signal;
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
