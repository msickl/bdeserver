import Helper from "@/js/helper.js";

export class WebSocketClient {
  private url: string;
  private websocket: WebSocket | null = null;
  private _connected: boolean = false;
  private onMessageCallback: ((msg: any) => void) | null;
  private callbacks: Record<string, any> = {};
  private connectionPromise: Promise<void>;
  private resolveConnection!: () => void;
  private rejectConnection!: (reason?: any) => void;

  public onOpen: (() => void) | null = null;
  public onClose: (() => void) | null = null;

  constructor(url: string, onMessageCallback: (msg: any) => void) {
    this.url = url;
    this.onMessageCallback = onMessageCallback;
    this.connectionPromise = new Promise<void>((resolve, reject) => {
      this.resolveConnection = resolve;
      this.rejectConnection = reject;
    });
    this.connect();
  }

  connect() {
    this.websocket = new WebSocket(this.url);

    this.websocket.onopen = () => {
      this._connected = true;
      this.onOpen?.(); 
      this.resolveConnection(); 
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
      this.onClose?.();
      setTimeout(() => this.connect(), 5000);
    };

    this.websocket.onerror = (error) => {
      this._connected = false;
      this.rejectConnection(error);
    };
  }

  get connected() {
    return this._connected;
  }

  waitForConnection(): Promise<void> {
    return this.connectionPromise;
  }

  send(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this._connected || !this.websocket) {
        return reject(new Error("WebSocket is not connected"));
      }

      const Id = new Helper().generateUUID();
      const messageWithId = { Id, ...payload };

      this.callbacks[Id] = {
        resolve,
        reject,
        handler: (response: any) => {
          const { Action } = response;
          if (["scanReceived", "scanTimedout", "scanClosed"].includes(Action)) {
            delete this.callbacks[Id];
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
