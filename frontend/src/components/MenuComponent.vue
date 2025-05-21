<template>
  <div>
    <!-- Menu 1 -->
    <div v-if="menu.current === 1" class="menu">
      <h1>Hauptmenü</h1>
      <div>
        <button @click="newProductInfo" class="btn btn-primary mt-3 w-100">Produktinformation</button>
        <br />
        <button @click="newStockBooking" class="btn btn-primary mt-3 w-100">Buchen</button>
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
    <div v-if="menu.current === 4 && credentialStore.isLoggedIn" class="menu">
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

const credentialStore = useCredentialStore();
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
  if(credentialStore.isLoggedIn)
  {
  menu.navigate(4);
  } else {

  }
  
 
}


watch(
  () => credentialStore.isLoggedIn,
  (newVal) => {
    if (!newVal) {
      menu.navigate(1);
    }
  }
);
</script>


<style scoped>
.menu {
  text-align: left;
}
</style>
