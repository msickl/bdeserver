export default class Stock {
    constructor() {
        this.id = '';
        this.locationid = '';
        this.name = '';
        this.locationname = '';
        this.operationtype = 1;
    }

    async fetch(id, locationid) {
        try {
            this.id = id;
            this.locationid = locationid;

            const response = await fetch(`/api/stock?id=${encodeURIComponent(this.id)}&locationid=${encodeURIComponent(this.locationid)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const stock = await response.json(); 

            if (stock.status === 'success' && stock.data) {
                const stockData = stock.data;
                
                this.id = stockData.Id;
                this.locationid = stockData.LocationId;
                this.name = stockData.Name;
                this.locationname = stockData.LocationName;

                return true;            
            } else {
                console.error('Error: Unsuccessful response or missing data.');
                return false;
            }
        } catch (error) {
            console.error('Error fetching item data:', error);
            return false;
        }
    }
}