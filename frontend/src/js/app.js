import Menu from './menu.js';
import Device from './device.js';
import Booking from './booking.js'
import User from './user.js';
import Stock from './stock.js';
import Form from './form.js';
import Item from './item.js';
import Order from './order.js';

const app = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            device: null,
            booking: null,
            menu: null,
            form: null,
            item: null
        };
    },
    created() {
        this.device = new Device("ws://127.0.0.1:8080/ws/");
        this.menu = new Menu();
        this.form = new Form();
    },
    methods: {
        async viewProductInfo() {
            const scannedCode = await this.device.scanner.Open('Artikel scannen');
            if(scannedCode == 'scanTimedout')
            {
                return;
            }

            if(scannedCode == 'scanClosed')
            {
                return;
            }

            this.item  = new Item();
            this.form.showLoaderDialog();
            let res = await this.item.fetch(scannedCode);
            this.form.hideLoaderDialog();

            if (res == true) {
                console.log("Navigation to page 2 - Item loaded successfully.");
                this.menu.navigate(2);
            } else {
                console.log("Navigation to page 3 - Failed to load item.");
                this.menu.navigate(3);
            }
        },
        async newStockBooking() {
            this.booking = new Booking();

            // User
            const user = new User();
            user.fetch(2345);
            this.booking.addUser(user);

            // Stock
            const stock = new Stock();
            stock.fetch(1, 20);
            this.booking.addStock(stock);

            this.menu.navigate(4);
        },
        async addNewStockbookingItem(Id = null)
        {
            if(Id == null)
            {
                const scannedCode = await this.device.scanner.Open('Anmelden');
                if(scannedCode == 'scanTimedout')
                {
                    return;
                }

                if(scannedCode == 'scanClosed')
                {
                    return;
                }

                this.form.showLoaderDialog();
                this.booking.addItem(scannedCode);
                this.form.hideLoaderDialog();
            } else {
                this.booking.addItem(Id);
            }
        },
        async addNewStockbookingItemSerial(guid, serial)
        {

        },
        async newStockBookingOrderQueryDialog()
        {
            const order = new Order();
            order.newOrderQueryDialog(this.form);
        },
        async login() {
            const scannedCode = await this.device.scanner.Open('Anmelden');
            console.log("Scanned Code:", scannedCode);
            if(scannedCode)
            {
                const obj = JSON.parse(scannedCode);

                const user = new User();
                if(await user.fetch(obj.userid))
                {
                    this.data.user = user;
                } 
                    
                const stock = new Stock();
                if(await stock.fetch(obj.stockid, obj.stocklocation))
                {
                    this.data.stock = stock;
                } 
            }
        },
        logout() {
            this.data.user = null;
            this.menu.navigate(1);
        },
        async newOrderQueryDialog()
        {
            try {
                const form = new Form();
                form.showLoaderDialog();

                const response = await fetch(`/api/order`);    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const res = await response.json();
                if (res.status === 'success' && res.data && res.data.length > 0) {
                    form.hideLoaderDialog();
                    const entry = await form.showSearchDialog('Auftragssuche', res.data);
                    console.log('test', entry);
                } else {
                    console.error('Error: Unsuccessful response or missing data.');
                }
            } catch (error) {
                console.error('Error fetching item data:', error);
            } finally {
                
            }
        },
        async newArticleScanDialog()
        {
            const scannedCode = await this.device.scanner.Open('Anmelden');
        }
    }
});

app.mount('#app');
