import { Loader } from '@/composables/LoaderComposable';
import { useScanStore } from '@/stores/useScanStore';
import Helper from "@/js/helper.js"

export default class Serial {
    constructor() {
        this.guid = new Helper().generateUUID();
        this.type = null;
        this.number = null;
    }

    async fetch(data) {
        const loader = Loader();
        
        loader.show();
        try {
            const response = await fetch(`/api/serial?data=${encodeURIComponent(data)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let res;
            try {
                res = await response.json();
            } catch (jsonError) {
                throw new Error('Error parsing JSON response: ' + jsonError.message);
            }

        
            if (res.status === 'success' && res.data) {
    
                if (Array.isArray(res.data) && res.data.length > 0) {
                    this.type = res.data.type;
                    this.number = res.data.number;
                    loader.hide();
                    return true;
                } else if (res.data.type && res.data.number) {
            
                    this.type = res.data.type;
                    this.number = res.data.number;
                    loader.hide();
                    return true;
                } else {
                    console.error('Error: Missing required data fields.');
                    loader.hide();
                    return false;
                }
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
        const id = await scanStore.scan('Seriennummer scannen');
        return await this.fetch(id);
    }
}