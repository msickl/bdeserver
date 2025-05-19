import Item from "./item.js";
import Stock from "./stock.js";
import User from "./user.js";
import Order from "./order.js";

export default class Booking {
    constructor() {
        this.user = new User(),
        this.stock = new Stock(),
        this.items = [],
        this.order = null;
        
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
                this.items.push(item);
                console.log(this.items);
            }
            
        } else {
            console.log('need to push same id');
        }
    }

    async addOrder()
    {
        const order = new Order();
        const result = await order.Search();
        this.order = result;
    }

    removeItem(Id)
    {
        const indexToRemove = this.items.findIndex(item => item.id === Id);
        if (indexToRemove !== -1) {
            this.items.splice(indexToRemove, 1);
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