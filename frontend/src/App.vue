<template>
  <div id="app">
    <TopbarComponent />
    <SidebarComponent />

    <MenuComponent />

    <SearchComponent 
      v-if="search.showSearch" 
      :searchData="search.searchData" 
      @close="search.showSearch = false" 
      @submit="search.handleSearchResult"
    />

    <ScannerComponent 
      v-if="scan.showScan"
      :scanTitle="scan.scanTitle"
      @close="scan.showScan = false" 
      @submit="scan.handleScanResult"
    />

    <LoaderComponent />

    <ConfirmationModal 
      v-if="confirmationModalStore.isModalVisible"
    />
    
    <NotificationModal 
      v-if="notificationModalStore.isModalVisible"
    />

    <Statusbar />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWebSocketStore } from '@/stores/useWebSocketStore';

import TopbarComponent from '@/components/TopbarComponent.vue';  
import MenuComponent from '@/components/MenuComponent.vue';

import { useScanStore } from '@/stores/useScanStore';
import ScannerComponent from '@/components/ScannerComponent.vue';

import { useSearchStore } from '@/stores/useSearchStore';
import SearchComponent from '@/components/SearchComponent.vue';

import SidebarComponent from '@/components/SidebarComponent.vue';
import LoaderComponent from '@/components/LoaderComponent.vue';

import { useConfirmationModalStore } from '@/stores/useConfirmationModalStore'
import ConfirmationModal from '@/components/ConfirmationModalComponent.vue'

import { useNotificationModalStore } from '@/stores/useNotificationModalStore'
import NotificationModal from '@/components/NotificationModalComponent.vue'

import Statusbar from './components/Statusbar.vue';

const ws = useWebSocketStore();
const search = useSearchStore();
const scan = useScanStore();
const confirmationModalStore = useConfirmationModalStore();
const notificationModalStore = useNotificationModalStore();

onMounted(async () => {
  await ws.initializeWebSocket("ws://127.0.0.1:8080/ws");
});

</script>

<style>
body {
  overflow: hidden;
  touch-action: pan-y;
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

#app {
  position: fixed;
  top: 60px; 
  bottom: 40px; 
  left: 0;
  right: 0;
  overflow-y: auto; 
  padding: 15px;
}

.battery-icon {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 20px;
  border: 2px solid white;
  border-radius: 3px;
  margin-right: 10px;
  text-align: center;
  color: white;
  font-size: 12px;
  line-height: 16px;
  overflow: hidden;
}

.battery-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #4caf50; 
  width: 0%; 
  z-index: -1; 
}

.battery-icon::after {
  content: '';
  position: absolute;
  top: 4px;
  right: -6px;
  width: 4px;
  height: 12px;
  background-color: white;
  border-radius: 1px;
}

.label-small-gray {
  font-size: 0.7em; /* Smaller label text */
  color: gray;
  display: block;
  margin-bottom: 0.1rem; /* Minimal space below the label */
  text-align: left;
}

.statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.connection-dot {
  margin-right: auto; /* Pushes the span to the far left */
}

small {
  margin-left: auto; /* Centers the small element in the remaining space */
  text-align: center;
  flex-grow: 1; /* Allows small text to take up the space in the middle */
}

.user-details {
  display: inline-block;
  font-size: 0.8em; /* Make text smaller */
  margin: 0;
  padding: 0;
  text-align: left;
}

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #343a40; 
  color: white;
  padding: 10px;
  z-index: 1000;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.custom-select {
  background-color: #f8f9fa; /* Change to desired color */
  color: #212529; /* Text color */
  border: 1px solid #ced4da; /* Border color */
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
}

.custom-select:focus {
  background-color: #e9ecef; /* Background color on focus */
  color: #495057; /* Text color on focus */
  outline: none; /* Remove default focus outline */
  border-color: #80bdff; /* Border color on focus */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}


.modal-backdrop {
  --bs-backdrop-zindex: -1 !important;
}

</style>
