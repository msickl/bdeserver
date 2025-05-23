<template>
  <div>
    <!-- Menu 1 -->
    <div v-if="menu.current === 1" class="menu">
      <h1 class="menu-title">Hauptmenü</h1>
      <div class="menu-content">
        <!-- Vorgänge -->
        <h2 class="menu-subheading">Lagerverwaltung</h2>
        <div class="spacer"></div>
        <button :disabled="!creds.isLoggedIn" @click="newStockBooking" class="btn btn-primary menu-btn w-100 position-relative text-center">
          <i class="fa fa-right-to-bracket position-absolute start-0 ms-3 top-50 translate-middle-y"></i>
          <span>Einlagern</span>
        </button>
        <div class="spacer"></div>
        <button :disabled="!creds.isLoggedIn" @click="newStockBooking" class="btn btn-primary menu-btn w-100 position-relative text-center">
          <i class="fa fa-right-from-bracket position-absolute start-0 ms-3 top-50 translate-middle-y"></i>
          <span>Auslagern</span>
        </button>
        <div class="spacer"></div>
        <button :disabled="true" class="btn btn-primary menu-btn w-100 position-relative text-center">
          <i class="fa fa-arrow-up-right-dots position-absolute start-0 ms-3 top-50 translate-middle-y"></i>
          <span>Inventur</span>
        </button>
        <div class="spacer"></div>
        <button :disabled="true" class="btn btn-primary menu-btn w-100 position-relative text-center">
          <i class="fa fa-shuffle position-absolute start-0 ms-3 top-50 translate-middle-y"></i>
          <span>Umlagern</span>
        </button>

        <!-- Versand -->
        <h2 class="menu-subheading">Logistik</h2>
        <div class="spacer"></div>
        <button :disabled="true" class="btn btn-primary menu-btn w-100 position-relative text-center">
          <i class="fa fa-box-open position-absolute start-0 ms-3 top-50 translate-middle-y"></i>
          <span>Wareneingang</span>
        </button>
        <div class="spacer"></div>
        <button :disabled="true" class="btn btn-primary menu-btn w-100 position-relative text-center">
          <i class="fa fa-box position-absolute start-0 ms-3 top-50 translate-middle-y"></i>
          <span>Kommissionieren</span>
        </button>
        <div class="spacer"></div>
        <button :disabled="true" class="btn btn-primary menu-btn w-100 position-relative text-center">
          <i class="fa fa-truck-fast position-absolute start-0 ms-3 top-50 translate-middle-y"></i>
          <span>Lieferung</span>
        </button>
        
        
        <div class="spacer"></div>

        <!-- Information -->
        <h2 class="menu-subheading">Informationen</h2>
        <div class="spacer"></div>
        <button @click="newProductInfo" class="btn btn-primary menu-btn w-100 position-relative text-center">
          <i class="fa fa-expand position-absolute start-0 ms-3 top-50 translate-middle-y"></i>
          <span>Produktinformationen</span>
        </button>
        <div class="spacer"></div>
        <button :disabled="true" class="btn btn-primary menu-btn w-100 position-relative text-center">
          <i class="fa fa-camera position-absolute start-0 ms-3 top-50 translate-middle-y"></i>
          <span>Dokumentation</span>
        </button>
        <div class="spacer"></div>
        
        <h2 class="menu-subheading">Neues Menu</h2>
        <div class="spacer"></div>
        <button @click="menu.navigate(5)" class="btn btn-primary w-100 menu-btn">Produktinformation</button>
        <div class="spacer"></div>
        <button @click="menu.navigate(6)" class="btn btn-primary w-100 menu-btn">Buchen</button>

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

    <div v-if="menu.current === 5" class="menu">
      <NewViewArticleInfo />
    </div>

    <div v-if="menu.current === 6" class="menu">
      <NewBookingMenu />
      <button @click="menu.navigate(1)" class="btn btn-danger mt-3 w-100">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed  } from 'vue';
import Item from '@/js/item';

import ProductInfoComponent from '@/components/Menu/ProductInfoComponent.vue';
import Booking from '@/components/Menu/Booking.vue';
import { useCredentialStore } from '../stores/useCredentialStore';

import NewBookingMenu from './newMenu/newBookingMenu.vue';
import { useMenuStore } from '../stores/useMenuStore';
import NewViewArticleInfo from './newMenu/newViewArticleInfo.vue';

const ProductInfoData = ref(null);

const creds = useCredentialStore();
const menu = useMenuStore();

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
    max-width: 600px;
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