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
      console.log("WS: Received message:", newResponse);

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
      console.log('📥 Message received in Pinia store:', message);
      this.lastMessage = message;
    },
    async sendMessage(payload) {
      if (this.websocketClient && this.connected) {
        return await this.websocketClient.send(payload);
      } else {
        console.warn('WebSocket not connected');
        return null;
      }
    },
  }
});
