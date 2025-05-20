import { defineStore } from 'pinia';
import { ref } from 'vue';
import Helper from "@/js/helper.js";

class WebSocketClient {
  constructor(url, onMessageCallback) {
    this.url = url;
    this.websocket = null;
    this._connected = ref(false);
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

      const { Id } = newResponse;

      if (Id && this.callbacks[Id]) {
        const { handler } = this.callbacks[Id];
        if (typeof handler === 'function') {
          handler(newResponse);
        }
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

  send(payload, customHandler) {
    return new Promise((resolve, reject) => {
      if (!this._connected) {
        return reject(new Error("WebSocket is not connected"));
      }

      const Id = new Helper().generateUUID();
      const messageWithId = { Id, ...payload };

      this.callbacks[Id] = {
        resolve,
        reject,
        handler: (response) => {
          const { Action, Data } = response;
          if (Action === 'scanReceived') {
            delete this.callbacks[Id];
            resolve(response);
          } else if (Action === 'scanTimedout') {
            delete this.callbacks[Id];
            response.Action = 'scanTimedout';
            resolve(response);
          } else if (Action === 'scanClosed') {
            delete this.callbacks[Id];
            response.Action = 'scanClosed';
            resolve(response);
          }
        },
      };

      try {
        this.websocket.send(JSON.stringify(messageWithId));
      } catch (error) {
        delete this.callbacks[Id];
        reject(error);
      }
    });
  }
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
      if (this.websocketClient && this.connected) {
        //console.log("Sending WebSocket Message:", payload);
        return this.websocketClient.send(payload);
      } else {
        console.warn('WebSocket not connected');
        return Promise.reject(new Error('WebSocket not connected'));
      }
    }
  },
});
