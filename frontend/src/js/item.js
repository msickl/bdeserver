import Serial from "./serial";

export default class Item {
    constructor() {
        this.guid = generateUUID();
        this.id = null;
        this.var1 = null;
        this.var2 = null;
        this.var3 = null;
        this.material = null;
        this.unit = null;
        this.unitdesc = null;
        this.serialrequired = null;
        this.serial = null;
    }

    async fetch(id) {
        try {
            const response = await fetch(`/api/item?id=${encodeURIComponent(id)}`);
                    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const res = await response.json();
            console.log("API Response:", res); 
    
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

    async addSerial()
    {
        const scannedCode = await this.scanner.openScanner('Seriennummer');
        console.log("Scanned Code:", scannedCode)

        const serial = new Serial();
        if(await serial.fetch(scannedCode))
        {
            this.serial = serial;
        }
    }
    
    removeSerial()
    {
        this.serial = null;
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}