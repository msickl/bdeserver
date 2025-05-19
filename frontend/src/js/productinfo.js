import Item from '@/js/item';

export default class ProductInfo {
    constructor() {
        this.item = new Item();
    }
    
    async getItem()
    {
        const res = await this.item.Scan();
        if(res)
        {
            return true;
        }
    }
}

