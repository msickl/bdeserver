import { Loader } from '@/composables/LoaderComposable';
import { useSearchStore } from '@/stores/useSearchStore';

export default class Order {
    constructor() {
        this.loader = Loader();
        this.searchStore = useSearchStore();
    }

    async Search()
    {   
        this.loader.show();
        try {
            const response = await fetch('/api/order');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const res = await response.json();

            if (res.status === 'success' && res.data?.length > 0) {
                this.loader.hide();
                const result = await this.searchStore.search(res.data);
                return result;
            } else {
                this.loader.hide();
                console.error('Error: Unsuccessful response or no data found.');
                return null;
            }
        } catch (error) {
            this.loader.hide();
            console.error('Error during openSearch():', error);
            return null;
        }
    }
}