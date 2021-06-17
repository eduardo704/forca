import { SocketService } from './socket.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  messages: Subject<any>;
  palavras: Subject<any>;
  usuarios: Subject<any>;
  palpite: Subject<any>;
  current: Subject<any>;
  youAre: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: SocketService) {
    this.messages = <Subject<any>>wsService.connect();
    this.palavras = <Subject<any>>wsService.connect('palavras');
    this.usuarios = <Subject<any>>wsService.connect('usuarios');
    this.current = <Subject<any>>wsService.connect('current');
    this.youAre = <Subject<any>>wsService.connect('youAre');

    this.palpite = <Subject<any>>wsService.connect('palpite');
  }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg: any) {
    this.messages.next(msg);
  }
  pegarPalavras(msg: any) {
    this.messages.next(msg);
  }
  palpitar(msg: any) {
    this.palpite.next(msg);
  }
  disconect(){
    this.wsService.disconcect()
  }
}
