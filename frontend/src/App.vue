<template>
  <div id="app">
    <TopbarComponent />
    
    <MenuComponent
      @open-search="handleOpenSearch"
      :searchResult="searchResult"

      @open-scan="handleOpenScan"
      :scanResult="scanResult"
    />

    <SearchComponent 
      v-if="showSearch" 
      :searchData="searchData" 
      @close="showSearch = false" 
      @submit="handleSearchResult"
    />

    <ScannerComponent 
      v-if="showScan"
      :scanTitle="scanTitle"
      @close="showScan = false" 
      @submit="handleScanResult"
    />
    <SidebarComponent />
    <LoaderComponent />

    <div class="statusbar">
      <small>J. Zimmer Maschinenbau GmbH</small>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWebSocketStore } from '@/stores/websocket';

import TopbarComponent from '@/components/Topbar.vue';  
import MenuComponent from '@/components/Menu.vue';
import ScannerComponent from '@/components/Scanner.vue';
import SearchComponent from '@/components/Search.vue';
import SidebarComponent from '@/components/Sidebar.vue';
import LoaderComponent from '@/components/Loader.vue';

const wsStore = useWebSocketStore();

// Search Component Store
const showSearch = ref(false);
const searchData = ref(null);
const searchResult = ref(null);

function handleOpenSearch(data) {
  searchData.value = data;
  showSearch.value = true;
}

function handleSearchResult(result) {
  searchResult.value = result;
  showSearch.value = false;
}

// Scan Component Store

const showScan = ref(false);
const scanTitle = ref(null);
const scanData = ref(null);
const scanResult = ref(null);

function handleOpenScan(title)
{
  scanTitle.value = title;
  showScan.value = true;
}

function handleScanResult(result) {
  scanData.value = result;
  showScan.value = false;
}

onMounted(() => {
  wsStore.initializeWebSocket("ws://127.0.0.1:8080/ws");
});
</script>

<style>
body {
  overflow: hidden;
  touch-action: pan-y;
}

.connection-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.connected {
  background-color: green; 
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

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #343a40;
  color: white;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 100;
  box-shadow: 2px 0 5px rgba(0,0,0,0.5);
}

.sidebar-show {
  transform: translateX(0);
}

.sidebar-content {
  padding: 1rem;
}

.sidebar .nav-link {
  color: white;
  padding: 0.5rem 0;
}

.sidebar .nav-link:hover {
  background-color: #495057;
  border-radius: 4px;
}

.modal-backdrop {
  --bs-backdrop-zindex: -1 !important;
}
</style>
