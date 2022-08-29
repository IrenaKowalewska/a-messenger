import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public webSocket!: WebSocket;
  public chatMessages = new BehaviorSubject<any[]>([]);

  constructor() { }

  public openWebSocket() {
    this.webSocket = new WebSocket('ws://localhost:6969')
    this.webSocket.onopen = (e) => {
      console.log('Open', e);
    }

    this.webSocket.onmessage = (e) => {
      console.log('On message', e);
      this.chatMessages.next(JSON.parse(e.data));
    }

    this.webSocket.onclose = (e) => {
      console.log('On close', e);
    }
  }

  public sendMessage(message: any) {
    this.webSocket.send(JSON.stringify(message.message));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }

}
