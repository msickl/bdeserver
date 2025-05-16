import Item from "./item.js";

export default class Booking {
    constructor() {
        this.user = null,
        this.stock = null,
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
    
    async addItem(Id)
    {
        const item = new Item();
        if(await item.fetch(Id))
        {
            this.items.push(item);
            return true;
        }
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