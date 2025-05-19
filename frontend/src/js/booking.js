import Item from "@/js/item.js";
import Stock from "@/js/stock.js";
import User from "@/js/user.js";
import Order from "@/js/order.js";
import Helper from "@/js/helper.js"
import Serial from "@/js/serial.js"

export default class Booking {
    constructor() {
        this.guid = new Helper().generateUUID(),
        this.user = new User(),
        this.stock = new Stock(),
        this.items = [],
        this.order = null
    }

    addUser(user)
    {
        this.user = user;
    }

    addStock(stock)
    {
        this.stock = stock;
    }
    
    async addItem(Id = null)
    {
        if(Id == null)
        {
            const item = new Item();
            const res = await item.Scan();

            if(res)
            {
                const existingItem = this.items.find(entry => entry.id === item.id);
                
                if (existingItem) {
                    existingItem.count++; 
                } else {
                    item.count = 1; 
                    this.items.push(item);
                }
            }
        } else {
            const existingItem = this.items.find(entry => entry.id === Id);
            existingItem.count++; 
        }
    }

    async addSerial(Id)
    {
        const existingItem = this.items.find(entry => entry.id === Id);
        if (existingItem) {
            const serial = new Serial();
            const res = await serial.Scan();
            if(res)
            {
                if (!existingItem.serials) {
                    existingItem.serials = [];
                }
                
                existingItem.serials.push(serial);
                console.log(existingItem.serials);
            }
        }
    }

    async addOrder()
    {
        const order = new Order();
        const res = await order.Search();
        if(res)
        {
            this.order = order;
        }
        
    }

    removeItem(Id)
    {
        const existingItem = this.items.find(entry => entry.id === Id);
        if (existingItem.count == 1) {
            this.items.splice(existingItem, 1);
        } else {
            existingItem.count--;
        }
    }

    groupedItems() {
        const groups = {};
        this.items.forEach(item => {
            if (!groups[item.id]) {
                groups[item.id] = [];
            }
            groups[item.id].push(item);
        });
        return groups;
    }
}