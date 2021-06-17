import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
//@ts-ignore
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket= io('http://localhost:3333');

  constructor() {}

  connect(message='message'): Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`


    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable((observer) => {
      this.socket.on(message, (data: any) => {
        console.log('Received message from Websocket Server');
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
      next: (data: Object) => {
        this.socket.emit(message, JSON.stringify(data));
      },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }

  disconcect(){
    this.socket.disconnect();
  }
}
