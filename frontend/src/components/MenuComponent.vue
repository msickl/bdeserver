<template>
  <div>
    <!-- Menu 1 -->
    <div v-if="menu.current === 1" class="menu">
      <h1>Hauptmenü</h1>
      <div>
        <button @click="viewProductInfo" class="btn btn-primary mt-3 w-100">Produktinformation</button>
        <br />
        <button @click="newStockBooking" class="btn btn-primary mt-3 w-100">Buchen</button>
      </div>
    </div>

    <!-- Menu 2 -->
    <div v-if="menu.current === 2" class="menu">
      <h3>Produktinformation</h3>
      <div v-if="item.id" class="value">
        <label class="label-small-gray">Artikelnummer</label>
        <div>{{ item.id }}</div>
      </div>
      <div v-if="item.var1" class="value">
        <label class="label-small-gray">Bezeichnung 1</label>
        <div style="font-weight: bold;">{{ item.var1 }}</div>
      </div>
      <div v-if="item.var2" class="value">
        <label class="label-small-gray">Bezeichnung 2</label>
        <div>{{ item.var2 }}</div>
      </div>
      <div v-if="item.var3" class="value">
        <label class="label-small-gray">Bezeichnung 3</label>
        <div>{{ item.var3 }}</div>
      </div>
      <div v-if="item.material" class="value">
        <label class="label-small-gray">Werkstoff</label>
        <div>{{ data.item.material }}</div>
      </div>
      <div v-if="item.standard" class="value">
        <label class="label-small-gray">Norm</label>
        <div>{{ standard }}</div>
      </div>
      <div v-if="item.unit" class="value">
        <label class="label-small-gray">Grundeinheit</label>
        <div>{{ item.unit }}</div>
      </div>
      <div v-if="item.unitdesc" class="value">
        <label class="label-small-gray">Einheit</label>
        <div>{{ item.unitdesc }}</div>
      </div>
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
      <h3>BENUTZER</h3>
      <div v-if="booking.user.username" class="value">
        <label class="label-small-gray">Benutzer</label>
        <div style="font-weight: bold;">{{ booking.user.username }}</div>
      </div>
      <hr />
      <h3>LAGER</h3>
      <div v-if="booking.stock.name" class="value">
        <label class="label-small-gray">Hauptlager</label>
        <div>{{ booking.stock.name }}</div>
      </div>
      <div v-if="booking.stock.locationname" class="value">
        <label class="label-small-gray">Lagerort</label>
        <div>{{ booking.stock.locationname }}</div>
      </div>
      <div class="mb-3">
        <label class="label-small-gray">Buchungsart</label>
        <select class="form-select custom-select" v-model="booking.stock.operationtype">
          <option value="1">Abbuchung</option>
          <option value="2">Rückbuchung</option>
          <option value="3">Inventur</option>
          <option value="4">Verschrottung</option>
        </select>
      </div>
      <h3>AUFTRAG</h3>
      <button @click="openSearchBookingOrderDialog" class="btn btn-primary mt-3 w-100">Auftrag erfassen</button>
      <div v-if="booking.order" class="value">
        <div v-if="booking.order" class="value">
          <label class="label-small-gray">Auftrag</label>
          <div>{{ booking.order.VORGNR }}</div>
        </div>
        <div v-if="booking.order" class="value">
          <label class="label-small-gray">Name</label>
          <div>{{ booking.order.NAME1 }}</div>
        </div>
      </div>
      <hr />
      
      <h3>ARTIKEL</h3>
      <button @click="openScanDialog" class="btn btn-primary mt-3 w-100">Artikel erfassen</button>
      <!-- 
      <div v-if="booking.items" class="value">
        <div v-for="(group, itemId) in booking.groupedItems()" :key="itemId">
          <div class="value">
            <label class="label-small-gray">Artikelnummer</label>
            <div>{{ itemId }}</div>
          </div>
          <div v-if="group[0].var1" class="value">
            <label class="label-small-gray">Bezeichnung 1</label>
            <div>{{ group[0].var1 }}</div>
          </div>
          <div v-if="group[0].var2" class="value">
            <label class="label-small-gray">Bezeichnung 2</label>
            <div>{{ group[0].var2 }}</div>
          </div>
          <div>
            <label class="label-small-gray">Anzahl</label>
            <div class="input-group">
              <input
                type="number"
                id="quantity"
                class="form-control text-center"
                v-model="group.length"
                min="0"
                :max="group.length"
              />
              <button @click="booking.removeItem(itemId)" class="btn btn-danger">-</button>
              <button @click="booking.addItem(itemId)" class="btn btn-success">+</button>
            </div>
          </div>
        </div>
      </div>
      -->
      <button class="btn btn-success mt-3 w-100">Buchen</button>
      <button @click="menu.navigate(1)" class="btn btn-danger mt-3 w-100">Close</button>
    </div>
  </div>
</template>

<script setup>

import { reactive  } from 'vue';
import Booking from '@/js/booking';
import { Loader } from '@/composables/LoaderComposable';
import Item from '../js/item';

import { useSearchStore } from '@/stores/useSearchStore';
import { useScanStore } from '@/stores/useScanStore';

const searchStore = useSearchStore();
const scanStore = useScanStore();

const item = reactive(new Item());
const booking = reactive(new Booking());
const loader = Loader();

const menu = reactive({
  current: 1,
  navigate(targetMenuId) {
    menu.current = targetMenuId;
  }
});

async function openSearchDialog() {
  try {
    loader.show();
    const response = await fetch('/api/order');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const res = await response.json();

    if (res.status === 'success' && res.data?.length > 0) {
      loader.hide();
      const result = await searchStore.search(res.data);
      console.log('Search result:', result);
    } else {
      console.error('Error: Unsuccessful response or no data found.');
    }
  } catch (error) {
    loader.hide();
    console.error('Error during openSearch():', error);
  }
}

async function openSearchBookingOrderDialog() {
  try {
    loader.show();
    const response = await fetch('/api/order');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const res = await response.json();

    if (res.status === 'success' && res.data?.length > 0) {
      loader.hide();
      const result = await searchStore.search(res.data);
      console.log('Search result:', result);
      booking.order = result;
    } else {
      console.error('Error: Unsuccessful response or no data found.');
    }
  } catch (error) {
    loader.hide();
    console.error('Error during openSearch():', error);
  }
}

async function openScanDialog() {
  const id = await scanStore.scan('Artikel erfassen');
  console.log('Scanned result:', id);
}


async function viewProductInfo() {
  const id = await scanStore.scan('Artikel Suchen');
  loader.show();
  const res = await item.fetch(id);
  if(res)
  {
    menu.navigate(2);
    loader.hide();
  }
}

async function newStockBooking() {
  await booking.user.fetch(2345);
  await booking.stock.fetch(1, 20);

  menu.navigate(4);
}

async function addNewStockbookingItem(Id = null) {
  if (Id === null) {
    const scannedCode = await device?.scanner?.Open('Anmelden');
    if (scannedCode === 'scanTimedout' || scannedCode === 'scanClosed') return;

    booking.items.push(scannedCode);
  } else {
    booking.items.push(Id);
  }
}

</script>


<style scoped>
.menu {
  text-align: left;
}
</style>
