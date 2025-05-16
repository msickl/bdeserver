import 'bootstrap'; 

export default class Serial {
    constructor() {
        this.type = null;
        this.number = null;
    }

    async fetch(data)
    {
        if(data)
        {
            const response = await fetch(`/api/serial?data=${encodeURIComponent(data)}`);
                
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const res = await response.json();
            console.log("API Response:", res); 
    
            if (res.status === 'success' && res.data) {
                this.type = res.data.type;
                this.number = res.data.number;
                
                return true;
            }
        } else {
            return false;
        }
    }
}