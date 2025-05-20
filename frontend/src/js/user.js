export default class User {
    constructor() {
        this.id = 2345;
        this.username = null;
    }

    async fetch(userId) {
        
        this.id = userId;
        
        try {
            const response = await fetch(`/api/user?id=${this.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const responseData = await response.json(); 
            this.username = responseData.data.userName;

            return true;
        } catch(error) {
            console.error('Error fetching item data:', error);
            return false;
        }
    }
}