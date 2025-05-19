import { defineStore } from 'pinia';

class WebSocketClient {
  constructor(url, onMessageCallback) {
    this.url = url;
    this.websocket = null;
    this._connected = false;
    this.onMessageCallback = onMessageCallback;
    this.callbacks = {};
    this.connect();
  }

  connect() {
    this.websocket = new WebSocket(this.url);

    this.websocket.onopen = () => {
      this._connected = true;
      console.log("Connected to WebSocket server");
    };

    this.websocket.onmessage = (event) => {
      const newResponse = JSON.parse(event.data);

      if (newResponse.Id && this.callbacks[newResponse.Id]) {
        const resolveCallback = this.callbacks[newResponse.Id];

        resolveCallback(newResponse);
        delete this.callbacks[newResponse.Id];
      }

      if (this.onMessageCallback) {
        this.onMessageCallback(newResponse);
      }
    };

    this.websocket.onclose = () => {
      this._connected = false;
      console.log("Disconnected from WebSocket server, retrying in 5 seconds...");
      setTimeout(() => this.connect(), 5000);
    };

    this.websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  get connected() {
    return this._connected;
  }

  send(payload) {
    return new Promise((resolve, reject) => {
      if (!this._connected) {
        return reject(new Error("WebSocket is not connected"));
      }

      const Id = generateUUID();
      this.callbacks[Id] = resolve;

      const messageWithId = { Id, ...payload };
      try {
        this.websocket.send(JSON.stringify(messageWithId));
      } catch (error) {
        reject(error);
        delete this.callbacks[Id];
      }
    });
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    websocketClient: null,
    lastMessage: null,
  }),
  getters: {
    connected: (state) => state.websocketClient?.connected ?? false,
  },
  actions: {
    initializeWebSocket(url) {
      this.websocketClient = new WebSocketClient(url, this.onMessage);
    },
    onMessage(message) {
      this.lastMessage = message;
    },
    sendMessage(payload) {
      console.log("Send Message:", payload);

      return new Promise((resolve, reject) => {
        if (this.websocketClient && this.connected) {
          // Send the initial message
          this.websocketClient.send(payload)
            .then(() => {
              // Now start listening for messages
              const messageListener = (message) => {
                console.log("Message received:", message);

                // Check for specific actions and handle them
                if (message.Action === 'scanReceived') {
                  console.log("Scan completed successfully:", message.Data);
                  resolve(message.Data); // Resolve the promise once the scan is received
                } else if (message.Action === 'scanTimedout') {
                  console.log("Scan timed out:", message.Data);
                  resolve('scanTimedout'); // Resolve the promise for scan timeout
                } else if (message.Action === 'scanClosed') {
                  console.log("Scan closed by user:", message.Data);
                  resolve('scanClosed'); // Resolve the promise for scan closed
                } else if (message.Action === 'scanActivated') {
                  console.log("Scan activated by user:", message.Data);
                  // You can add more logic here for scanActivated if needed
                } else {
                  console.log("Unexpected response action:", message);
                }
              };

            })
            .catch((error) => {
              console.error("Error while sending message:", error);
              reject(error); // Reject promise if sending message fails
            });
        } else {
          console.warn('WebSocket not connected');
          reject(new Error('WebSocket not connected')); // Reject if WebSocket is not connected
        }
      });
    },
  }
});

