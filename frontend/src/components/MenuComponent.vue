<template>
  <div>
    <!-- Menu 1 -->
    <div v-if="menu.current === 1" class="menu">
      <h1 class="menu-title">Hauptmenü</h1>
      <div class="menu-content">
        <h2 class="menu-subheading">Anzeigen</h2>
        <div class="spacer"></div>
        <button @click="newProductInfo" class="btn btn-primary w-100 menu-btn">Produktinformationen</button>
        <div class="spacer"></div>
        <h2 class="menu-subheading">Buchen</h2>
        <div class="spacer"></div>
        <button :disabled="!creds.isLoggedIn" @click="newStockBooking" class="btn btn-primary w-100 menu-btn">Lagerbuchung</button>
         <div class="spacer"></div>
        <button :disabled="true" class="btn btn-primary w-100 menu-btn disabled-btn">Wareneingang</button>
        <div class="spacer"></div>
        <h2 class="menu-subheading">Wiegen</h2>
        <div class="spacer"></div>
        <button :disabled="true" class="btn btn-primary w-100 menu-btn disabled-btn">Gewicht erfassen</button>
        <div class="spacer"></div>
        
      </div>
    </div>
    <!-- Menu 2 -->
    <div v-if="menu.current === 2" class="menu">
      <ProductInfoComponent 
        :data="ProductInfoData"
      />
     <div class="buttons">
        <button @click="menu.navigate(1)" class="btn btn-primary mt-3 w-100">Close</button>
      </div>
    </div>

    <!-- Menu 3 (Error Message) -->
    <div v-if="menu.current === 3" class="menu">
      <h1>ERROR</h1>
      <p>Artikel nicht vorhanden.</p>
      <div class="buttons">
        <button @click="menu.navigate(1)" class="btn btn-primary mt-3 w-100">Close</button>
      </div>
    </div>

    <!-- Menu 4 Booking -->
    <div v-if="menu.current === 4" class="menu">
      <Booking />
      <button @click="menu.navigate(1)" class="btn btn-danger mt-3 w-100">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch  } from 'vue';
import Item from '@/js/item';

import ProductInfoComponent from '@/components/Menu/ProductInfoComponent.vue';
import Booking from '@/components/Menu/Booking.vue';
import { useCredentialStore } from '../stores/useCredentialStore';

const ProductInfoData = ref(null);

const creds = useCredentialStore();
const menu = reactive({
  current: 1,
  navigate(targetMenuId) {
    menu.current = targetMenuId;
  }
});

async function newProductInfo(){
  const item = new Item();
  const res = await item.Scan();

  if(res)
  {
    ProductInfoData.value = item;
    menu.navigate(2);
  }
}

async function newStockBooking() {
  if(creds.isLoggedIn)
  {
    menu.navigate(4);
  } else {

  }
}


watch(
  () => creds.isLoggedIn,
  (newVal) => {
    if (!newVal) {
      menu.navigate(1);
    }
  }
);
</script>

<style scoped>
  .menu {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: auto;
    text-align: left;
  }

  .menu-title {
    font-family: 'Arial', sans-serif;
    font-size: 2rem;
    color: #007bff;
    margin-bottom: 20px;
  }

  .menu-subheading {
    font-family: 'Arial', sans-serif;
    font-size: 1.5rem;
    color: #343a40;
    margin-top: 20px;
  }

  .menu-btn {
    background-color: #007bff;
    border: none;
    padding: 15px;
    font-size: 1.1rem;
    color: white;
    transition: background-color 0.3s ease;
    border-radius: 5px;
  }

  .menu-btn:hover {
    background-color: #0056b3;
  }

  .disabled-btn {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  .menu-content {
    margin-top: 20px;
  }

  .spacer {
    height: 15px;
  }
</style>