import 'bootstrap'; 

export default class Scanner {
    constructor(wsClient) {
        this.modal = null;
        this._server = wsClient;
        this.isScanRequested = false; // Flag to ensure the scan is only requested once per modal session
    }

    async Open(title) {
        return new Promise((resolve) => {

            this.modal = new bootstrap.Modal(document.getElementById('scannerModal'));
            document.getElementById('scannerModalLabel').innerText = title;

            this.isScanRequested = false;

            this.modal.show();

            const modalShownHandler = () => {
                if (!this.isScanRequested) {

                    this.isScanRequested = true;
                    const payload = {
                        "Action": "startScan",
                        "Data": null
                    };

                    this._server.send(payload)
                        .then((response) => {
                            console.log("Final response received:", response);
                            if (response.Action === 'scanReceived') {
                                console.log("Scan completed successfully:", response.Data);
                                this.Close(); 
                                resolve(response.Data);
                            } else if (response.Action === 'scanTimedout') {
                                console.log("Scan timed out:", response.Data);
                                this.Close();
                                resolve('scanTimedout');
                            } else if (response.Action === 'scanClosed') {
                                console.log("Scan closed by user:", response.Data);
                                this.Close(); 
                                resolve('scanClosed');
                            }
                        })
                        .catch((error) => {
                            console.error("Error occurred:", error);
                            this.Close();  
                            resolve(null); 
                        });

                    document.getElementById('scannerModal').removeEventListener('shown.bs.modal', modalShownHandler);
                }
            };

            document.getElementById('scannerModal').addEventListener('shown.bs.modal', modalShownHandler);
        });
    }

    Close() {
        if (this.modal) {
            this.modal.hide();
        }
        const payload = {
            "Action": "closeScan",
            "Data": null
        };
        this._server.send(payload) 
            .catch((error) => {
                console.error("Error closing scan:", error);
            });

        this.isScanRequested = false;
    }
}
