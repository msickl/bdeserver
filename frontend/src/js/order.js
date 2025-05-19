export default class Order {
    constructor() {

    }

    async newOrderQueryDialog(form)
    {
        this.form = form;
        try {
            this.form = new Form();
            this.form.showLoaderDialog();

            const response = await fetch(`/api/order`);    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const res = await response.json();
            if (res.status === 'success' && res.data && res.data.length > 0) {
                this.form.showSearchDialog('Auftragssuche', res.data);
            } else {
                console.error('Error: Unsuccessful response or missing data.');
            }
        } catch (error) {
            console.error('Error fetching item data:', error);
        } finally {
            this.form.hideLoaderDialog();
        }
    }
}