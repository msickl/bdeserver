import { defineStore } from 'pinia';
import { WebSocketClient } from '../js/wsclient.js';

interface WebSocketStoreState {
  websocketClient: WebSocketClient | null;
  lastMessage: any; // evtl. anpassen je nach Message-Format
  isConnected: boolean;
}

export const useWebSocketStore = defineStore('websocket', {
  state: (): WebSocketStoreState => ({
    websocketClient: null,
    lastMessage: null,
    isConnected: false
  }),
  getters: {
    connected: (state): boolean => state.websocketClient?.connected ?? false,
  },
  actions: {
    async initializeWebSocket(url: string) {
      this.websocketClient = new WebSocketClient(url, this.onMessage.bind(this));

      this.websocketClient.onOpen = () => {
        this.isConnected = true;
        console.log('WebSocketStore: connected');
      };

      this.websocketClient.onClose = () => {
        this.isConnected = false;
        console.log('WebSocketStore: disconnected');
      };

      await this.websocketClient.waitForConnection();
    },
    onMessage(message: any) {
      this.lastMessage = message;
    },
    async sendMessage(payload: any): Promise<any> {
      const waitUntil = async (condition: () => boolean, timeout = 5000) => {
        const start = Date.now();
        while (!condition()) {
          if (Date.now() - start > timeout) {
            throw new Error('WebSocket not connected (timeout)');
          }
          await new Promise(res => setTimeout(res, 100));
        }
      };

      await waitUntil(() => this.isConnected);

      if (this.websocketClient) {
        return this.websocketClient.send(payload);
      } else {
        return Promise.reject(new Error('WebSocket client not available'));
      }
    }
  },
});
