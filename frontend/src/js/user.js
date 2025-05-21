export default class User {
    constructor() {
        this.employeeId = '';
        this.username = '';
        this.firstName = '';
        this.lastName = '';
    }

    async fetch(userId) {
        try {
            const response = await fetch(`/api/user?id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const responseData = await response.json(); 
            this.employeeId = responseData.data.employeeId;
            this.username = responseData.data.userName;
            this.firstName = responseData.data.firstName;
            this.lastName = responseData.data.lastName;

            return true;
        } catch(error) {
            console.error('Error fetching item data:', error);
            return false;
        }
    }
}