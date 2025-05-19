import { Loader } from '@/composables/LoaderComposable';
import { useSearchStore } from '@/stores/useSearchStore';
import Helper from "@/js/helper.js"

export default class Order {
    constructor() {
        this.guid = new Helper().generateUUID(),

        this.BEZ = null;
        this.ERSTELLT = null;
        this.GRUPPE = null;
        this.KUNR = null;
        this.KURZ = null;
        this.KURZBEZ = null;
        this.LTPROD = null;
        this.NAME1 = null;
        this.UIDLAND = null;
        this.VORGANG = null;
        this.VORGNR = null;
        this.VORGTYP = null;
    }

    async fetchAll()
    {
        const loader = Loader();
        loader.show();
        try {
            const response = await fetch('/api/order');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const res = await response.json();

            if (res.status === 'success' && res.data?.length > 0) {
                loader.hide();
                return res.data;
            } else {
                loader.hide();
                console.error('Error: Unsuccessful response or no data found.');
                return null;
            }
        } catch (error) {
            loader.hide();
            console.error('Error during order fetch all', error);
            return null;
        }
    }

    async Search()
    {   
        const data = await this.fetchAll();

        const searchStore = useSearchStore();
        const result = await searchStore.search(data);

        this.BEZ = result.BEZ;
        this.ERSTELLT = result.ERSTELLT;
        this.GRUPPE = result.GRUPPE;
        this.KUNR = result.KUNR;
        this.KURZ = result.KURZ;
        this.KURZBEZ = result.KURZBEZ;
        this.LTPROD = result.LTPROD;
        this.NAME1 = result.NAME1;
        this.UIDLAND = result.UIDLAND;
        this.VORGANG = result.VORGANG;
        this.VORGNR = result.VORGNR;
        this.VORGTYP = result.VORGTYP;

        return true;
    }
}