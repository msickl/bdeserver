import Item from "@/js/item.js";
import Stock from "@/js/stock.js";
import User from "@/js/user.js";
import Order from "@/js/order.js";
import Helper from "@/js/helper.js";
import Serial from "@/js/serial.js";
import { useConfirmationModalStore } from '@/stores/useConfirmationModalStore';
import { useNotificationModalStore } from '@/stores/useNotificationModalStore';

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
                    if(item.serialrequired && !item.serials)
                    {
                        item.serials = [];
                    }
                    item.count = 1; 
                    this.items.push(item);
                }
            }
        } else {
            const existingItem = this.items.find(entry => entry.id === Id);
            existingItem.count++; 
        }
    }

    removeItem(Id) {
        const existingItem = this.items.find(entry => entry.id === Id);
    
        if (!existingItem) {
            return; // Item with Id not found
        }
        
        const serialCount = existingItem.serials?.length || 0;
        
        if (existingItem.count > serialCount) {
            if (existingItem.count === 1) {
                this.items.splice(existingItem, 1);
            } else {
                existingItem.count--;
            }
        } else {
            const notificationModal = useNotificationModalStore();
            notificationModal.showModal('remove first all serials');
        }
    }

    async addSerial(Id) {
        const existingItem = this.items.find(entry => entry.id === Id);
        if (existingItem) {
            const serial = new Serial();
            const res = await serial.Scan();
            if (res) {
                if (!existingItem.serials) {
                    existingItem.serials = [];
                }
                // check if serial already exists (use '===' for comparison)
                const existingSerialIndex = existingItem.serials.findIndex(entry => entry.number === serial.number);
                if (existingSerialIndex === -1) {
                    existingItem.serials.push(serial);
                } else {
                    const notificationModal = useNotificationModalStore();
                    notificationModal.showModal('Serial already exists');
                }
            }
        }
    }


    async removeSerial(Id, Guid) {
        const existingItem = this.items.find(entry => entry.id === Id);
        if (existingItem) {
            const existingSerialIndex = existingItem.serials.findIndex(entry => entry.guid === Guid);
            if (existingSerialIndex !== -1) {
                existingItem.serials.splice(existingSerialIndex, 1);
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
}