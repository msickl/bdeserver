import { Loader } from '@/composables/LoaderComposable';
import { useScanStore } from '@/stores/useScanStore';
import Helper from "@/js/helper.js";

export default class Item {
    constructor() {
        this.guid = new Helper().generateUUID();
        this.id = null;
        this.var1 = null;
        this.var2 = null;
        this.var3 = null;
        this.material = null;
        this.unit = null;
        this.unitdesc = null;
        this.serialrequired = null;
    }

    async fetch(id) {
        const loader = Loader();
        
        loader.show();
        try {
            const response = await fetch(`/api/item?id=${encodeURIComponent(id)}`);
                    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const res = await response.json();
    
            if (res.status === 'success' && res.data && res.data.length > 0) {
                const itemData = res.data[0];
                
                this.id = itemData.ITM_IDNR;
                this.var1 = itemData.ITM_VAR1;
                this.var2 = itemData.ITM_VAR2;
                this.var3 = itemData.ITM_VAR3;
                this.material = itemData.ITM_MATERIAL;
                this.unit = itemData.ITM_UNIT;
                this.unitdesc = itemData.ITM_UNIT_DESC;
                this.serialrequired = itemData.ITM_SERIALREQUIRED;

                loader.hide();
                return true;            
            } else {
                console.error('Error: Unsuccessful response or missing data.');
                loader.hide();
                return false;
            }
        } catch (error) {
            console.error('Error fetching item data:', error);
            loader.hide();
            return false;
        }
    }

    async Scan()
    {
        const scanStore = useScanStore();
        const id = await scanStore.scan('Artikel Suchen');
        return await this.fetch(id);
    }
}