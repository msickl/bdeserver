import Scanner from './scanner.js';
import WebSocketClient from '../stores/websocket.js';

export default class Device {
    constructor(wsUrl) {
        this.wirelessStrength = 0,
        this.batteryStatus = 0

        this.wsclient = new WebSocketClient(wsUrl);
        this.scanner = new Scanner(this.wsclient);
    }
}