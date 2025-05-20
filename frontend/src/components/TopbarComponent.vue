<template>
    <div class="topbar">
      <div class="beacon-button" @click="toggleSidebar">
        <svg viewBox="0 0 100 100" width="40" height="40">
          <path class="line top" :class="{ active: showSidebar }" d="M 20,29 H 80" />
          <path class="line middle" :class="{ active: showSidebar }" d="M 20,50 H 80" />
          <path class="line bottom" :class="{ active: showSidebar }" d="M 20,71 H 80" />
        </svg>
      </div>
      <!--
      <div class="user-details" v-if="data.user">
        {{ data.user.username }}
      </div>
      <div class="battery-icon" v-if="data.device.batteryStatus">
        <div class="battery-fill" :style="{ width: data.device.batteryStatus + '%' }"></div>
      </div>
      <div class="wifi-icon" v-if="data.device.wirelessStrength">
        <div class="wifi-fill" :style="{ width: data.device.wirelessStrength + '%' }"></div>
      </div>
      -->
    
    </div>

</template>

<script setup>
import { ref } from 'vue';
const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};
const isConnected = ref(true);

</script>


<style scoped>

</style>
