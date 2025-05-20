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
      <h3>Produktinformation</h3>
      <div v-if="pi.item.id" class="value">
        <label class="label-small-gray">Artikelnummer</label>
        <div>{{ pi.item.id }}</div>
      </div>
      <div v-if="pi.item.var1" class="value">
        <label class="label-small-gray">Bezeichnung 1</label>
        <div style="font-weight: bold;">{{ pi.item.var1 }}</div>
      </div>
      <div v-if="pi.item.var2" class="value">
        <label class="label-small-gray">Bezeichnung 2</label>
        <div>{{ pi.item.var2 }}</div>
      </div>
      <div v-if="pi.item.var3" class="value">
        <label class="label-small-gray">Bezeichnung 3</label>
        <div>{{ pi.item.var3 }}</div>
      </div>
      <div v-if="pi.item.material" class="value">
        <label class="label-small-gray">Werkstoff</label>
        <div>{{ pi.item.material }}</div>
      </div>
      <div v-if="pi.item.standard" class="value">
        <label class="label-small-gray">Norm</label>
        <div>{{ pi.item.standard }}</div>
      </div>
      <div v-if="pi.item.unit" class="value">
        <label class="label-small-gray">Grundeinheit</label>
        <div>{{ pi.item.unit }}</div>
      </div>
      <div v-if="pi.item.unitdesc" class="value">
        <label class="label-small-gray">Einheit</label>
        <div>{{ pi.item.unitdesc }}</div>
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
      <button @click="booking.addOrder()" class="btn btn-primary mt-3 w-100">Auftrag erfassen</button>
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
      <button @click="booking.addItem()" class="btn btn-primary mt-3 w-100">Artikel erfassen</button>
    
      <div v-if="booking.items" class="value">
        <div v-for="item in booking.items" :key="item.id">
          <div class="value">
            <label class="label-small-gray">Artikelnummer</label>
            <div>{{ item.id }}</div>
          </div>
          <div v-if="item.var1" class="value">
            <label class="label-small-gray">Bezeichnung 1</label>
            <div>{{ item.var1 }}</div>
          </div>
          <div v-if="item.var2" class="value">
            <label class="label-small-gray">Bezeichnung 2</label>
            <div>{{ item.var2 }}</div>
          </div>
          <div>
            <label class="label-small-gray">Anzahl</label>
            <div class="input-group">
              <input
                type="number"
                id="quantity"
                class="form-control text-center"
                v-model="item.count"
                min="0"
                :max="item.count"
              />
              <button @click="booking.removeItem(item.id)" class="btn btn-danger">-</button>
              <button @click="booking.addItem(item.id)" class="btn btn-success">+</button>
            </div>
          </div>
          <div v-if="item.serialrequired">
            <div v-for="serial in item.serials" :key="serial.guid" class="serial-item">
              <div class="input-group">
                <div class="value">
                  <label class="label-small-gray">{{ serial.type }}</label>
                  <div class="serial-number">{{ serial.number }}</div>
                </div>
                <button @click="booking.removeSerial(item.id, serial.guid)" class="btn btn-danger remove-btn">-</button>
              </div>
            </div>
            <button v-if="item.count > item.serials.length" @click="booking.addSerial(item.id)" class="btn btn-success add-btn">Add Serial</button>
          </div>
        </div>
      </div>
      <button class="btn btn-success mt-3 w-100">Buchen</button>
      <button @click="menu.navigate(1)" class="btn btn-danger mt-3 w-100">Close</button>
    </div>
  </div>
</template>

<script setup>

import { reactive  } from 'vue';
import Booking from '@/js/booking';
import ProductInfo from '@/js/productinfo';

const pi = reactive(new ProductInfo());
const booking = reactive(new Booking());


const menu = reactive({
  current: 1,
  navigate(targetMenuId) {
    menu.current = targetMenuId;
  }
});

async function newProductInfo(){
  const result = await pi.getItem();
  if(result)
  {
    menu.navigate(2);
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

.serial-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-top:7px;
}

.input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value {
  flex-grow: 1;
}

.label-small-gray {
  font-size: 0.9rem;
  color: #777;
}

.serial-number {
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 5px;
}

.remove-btn {
  padding: 6px 12px;
  font-size: 1.1rem;
  border-radius: 5px;
  background-color: #dc3545;
  color: white;
}

.remove-btn:hover {
  background-color: #c82333;
}

.add-btn {
  width: 100%;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 15px;
}

.add-btn:hover {
  background-color: #218838;
}


</style>
