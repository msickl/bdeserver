<template>
  <div>
    <UserInfo />
    <hr />
    <StockInfo />
    <hr />
    <div v-if="credentialStore.stock.operationtype !== 3 && credentialStore.stock.operationtype !== 4">
      <button @click="addOrder" class="btn btn-primary mt-3 w-100">Auftrag erfassen</button>
      <OrderInfo :order="booking.order" />
    </div>
    <hr v-if="booking.order"/>
    <button v-if="booking.order" @click="addItem(null)" class="btn btn-primary mt-3 w-100">Artikel erfassen</button>
    <ItemInfo 
      :items="booking.items"
      @addItem="addItem"
      @removeItem="removeItem"
      @addSerial="addSerial"
      @removeSerial="removeSerial"
    />
    <hr />
    <button v-if="booking.items.length > 0 " class="btn btn-success mt-3 w-100">Buchen</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

import UserInfo from '@/components/Menu/UserInfo.vue';
import StockInfo from '@/components/Menu/StockInfo.vue';
import OrderInfo from '@/components/Menu/OrderInfo.vue';
import ItemInfo from '@/components/Menu/ItemInfo.vue';

import Item from "@/js/item.js";
import Order from "@/js/order.js";
import Helper from "@/js/helper.js";
import Serial from "@/js/serial.js";
import { useConfirmationModalStore } from '@/stores/useConfirmationModalStore';
import { useNotificationModalStore } from '@/stores/useNotificationModalStore';
import { useCredentialStore } from '@/stores/useCredentialStore';

const credentialStore = useCredentialStore();

const booking = reactive({
  guid: new Helper().generateUUID(),
  order: null,
  items: []
});

async function addOrder() { 
  const order = new Order();
  const res = await order.Search();
  if(res)
  {
      booking.order = order;
  }
}

async function addItem(Id) {
  if (Id == null) {
    const item = new Item();
    const res = await item.Scan();

    if (res) {
      const existingItem = booking.items.find(entry => entry.id === item.id);

      if (existingItem) {
        existingItem.count++;
      } else {
        if (item.serialrequired && !item.serials) {
          item.serials = [];
        }
        item.count = 1;
        booking.items.push(item); 
      }
    }
  } else {
    const existingItem = booking.items?.find(entry => entry.id === Id);

    if (existingItem) {
      existingItem.count++; 
    } else {
      console.error('Item not found with the given Id:', Id); 
    }
  }
}

function removeItem(Id) { 
  const existingItem = booking.items.find(entry => entry.id === Id);
  
  if (!existingItem) {
      return; 
  }
  
  const serialCount = existingItem.serials?.length || 0;
  
  if (existingItem.count > serialCount) {
      if (existingItem.count === 1) {
          booking.items.splice(existingItem, 1);
      } else {
          existingItem.count--;
      }
  } else {
      const notificationModal = useNotificationModalStore();
      notificationModal.showModal('Es muss zuerst eine Seriennummer entfernt werden um einen weiteren Artikel zu löschen.');
  }
}

async function addSerial(Id) { 
  const existingItem = booking.items.find(entry => entry.id === Id);
  if (existingItem) {
      const serial = new Serial();
      const res = await serial.Scan();
      if (res) {
          if (!existingItem.serials) {
              existingItem.serials = [];
          }
          const existingSerialIndex = existingItem.serials.findIndex(entry => entry.number === serial.number);
          if (existingSerialIndex === -1) {
              existingItem.serials.push(serial);
          } else {
              const notificationModal = useNotificationModalStore();
              notificationModal.showModal('Seriennummer existiert bereits.');
          }
      }
  }
}
async function removeSerial(Id, Guid) { 
  const existingItem = booking.items.find(entry => entry.id === Id);
  if (existingItem) {
      const existingSerialIndex = existingItem.serials.findIndex(entry => entry.guid === Guid);
      if (existingSerialIndex !== -1) {
          const confirmationModal = useConfirmationModalStore();
          const res = await confirmationModal.showModal('Willst du die Seriennummer wirklich löschen ?');
          if(res)
          {
              existingItem.serials.splice(existingSerialIndex, 1);
          }
      }
  }  
}



</script>
