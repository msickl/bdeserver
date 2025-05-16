<template>
  <div>
    <!-- Menu 1 -->
    <div v-if="menu.current === 1" class="menu">
      <h1>Hauptmenü</h1>
      <div>
        <button @click="viewProductInfo" class="btn btn-primary mt-3 w-100">Produktinformation</button>
        <br />
        <button @click="newStockBooking" class="btn btn-primary mt-3 w-100">Buchen</button>
        <br />
        <button @click="openSearch" class="btn btn-primary mt-3 w-100">Auftrag erfassen</button>
        <br />
        <button @click="newArticleScanDialog" class="btn btn-primary mt-3 w-100">Artikel erfassen</button>
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
      <button @click="newStockBookingOrderQueryDialog" class="btn btn-primary mt-3 w-100">Auftrag erfassen</button>
      <div v-if="form.searchDialogSelectedEntry" class="value">
        <div v-if="form.searchDialogSelectedEntry" class="value">
          <label class="label-small-gray">Auftrag</label>
          <div>{{ form.searchDialogSelectedEntry.VORGNR }}</div>
        </div>
        <div v-if="form.searchDialogSelectedEntry" class="value">
          <label class="label-small-gray">Name</label>
          <div>{{ form.searchDialogSelectedEntry.NAME1 }}</div>
        </div>
      </div>
      <hr />
      <h3>ARTIKEL</h3>
      <button @click="addNewStockbookingItem" class="btn btn-primary mt-3 w-100">Artikel erfassen</button>

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
      <button class="btn btn-success mt-3 w-100">Buchen</button>
      <button @click="menu.navigate(1)" class="btn btn-danger mt-3 w-100">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuComponent",
  emits: ['open-search'],
  data() {
    return {
      menu: {
        current: 1,
        navigate(targetMenuId) {
          this.current = targetMenuId;
        }
      },
      item: {},
      booking: {
        user: {},
        stock: {},
        items: [],
        groupedItems() {
          return {}; 
        }
      }
    };
  },
  props: {
    searchResult: Object 
  },
  watch: {
    searchResult(newValue) {
      if (newValue) {
        console.log('Received in Menu.vue:', newValue);
      }
    }
  },
  methods: {
    async newArticleScanDialog() {
      const scannedCode = await this.device?.scanner?.Open('Anmelden');
      console.log(scannedCode);
    },
    
    async openSearch() {
      try {
        //this.form.showLoaderDialog();

        const response = await fetch('/api/order');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        //this.form.hideLoaderDialog();

        if (res.status === 'success' && res.data?.length > 0) {
          // Emit data to parent to open Search.vue
          this.$emit('open-search', res.data);
        } else {
          console.error('Error: Unsuccessful response or no data found.');
        }
      } catch (error) {
        console.error('Error during openSearch():', error);
        //this.form.hideLoaderDialog();
      }
    },

    async newOrderQueryDialog() {
      try {
        //const form = new Form();
        //form.showLoaderDialog();

        const response = await fetch(`/api/order`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const res = await response.json();
        if (res.status === 'success' && res.data?.length > 0) {
          //form.hideLoaderDialog();
          //const entry = await form.showSearchDialog('Auftragssuche', res.data);
          //console.log('test', entry);
        } else {
          console.error('No entries found.');
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    },

    async viewProductInfo() {
      const scannedCode = await this.device.scanner.Open('Artikel scannen');
      if (scannedCode === 'scanTimedout' || scannedCode === 'scanClosed') return;

      this.item = new Item();

      //this.form.showLoaderDialog();
      let res = await this.item.fetch(scannedCode);
      //this.form.hideLoaderDialog();

      if (res === true) {
        console.log("Navigation to page 2 - Item loaded successfully.");
        this.menu.navigate(2);
      } else {
        console.log("Navigation to page 3 - Failed to load item.");
        this.menu.navigate(3);
      }
    },
    async newStockBooking() {
      this.booking = new Booking();

      const user = new User();
      await user.fetch(2345);
      this.booking.addUser(user);

      const stock = new Stock();
      await stock.fetch(1, 20);
      this.booking.addStock(stock);

      this.menu.navigate(4);
    },
    async addNewStockbookingItem(Id = null) {
      if (Id == null) {
        const scannedCode = await this.device.scanner.Open('Anmelden');
        if (scannedCode === 'scanTimedout' || scannedCode === 'scanClosed') return;

        //this.form.showLoaderDialog();
        this.booking.addItem(scannedCode);
        //this.form.hideLoaderDialog();
      } else {
        this.booking.addItem(Id);
      }
    },
    async login() {
      const scannedCode = await this.device.scanner.Open('Anmelden');
      console.log("Scanned Code:", scannedCode);
      if (scannedCode) {
        const obj = JSON.parse(scannedCode);

        const user = new User();
        if (await user.fetch(obj.userid)) {
          this.user = user;
        }

        const stock = new Stock();
        if (await stock.fetch(obj.stockid, obj.stocklocation)) {
          this.stock = stock;
        }
      }
    },
    logout() {
      this.user = null;
      this.menu.navigate(1);
    },
    async newOrderQueryDialog() {
      try {
        //const form = new Form();
        //form.showLoaderDialog();

        const response = await fetch(`/api/order`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const res = await response.json();
        if (res.status === 'success' && res.data && res.data.length > 0) {
          //form.hideLoaderDialog();
          //const entry = await form.showSearchDialog('Auftragssuche', res.data);
          //console.log('test', entry);
        } else {
          console.error('Error: Unsuccessful response or missing data.');
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    },
    async newArticleScanDialog() {
      // Future implementation
    }
  }
};
</script>

<style scoped>
.menu {
  text-align: left;
}
</style>
