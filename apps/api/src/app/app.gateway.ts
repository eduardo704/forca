import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
const palavras = [
  'Casal',
  'Pulsar',
  'Refletir',
  'Subir',
  'Flash',
  'Cosmético',
  'Taberna',
  'Precioso',
  'Todos',
  'Insulto',
  'Acesso',
  'Loja',
  'Costelas',
  'Piada',
  'Trombeta',
  'Oceano',
  'Silicone',
  'Trilho',
  'Charuto',
  'Percentagem',
];
@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  usuarios = [];
  palavras = [];
  charess: Array<WordChar[]> = [];
  currentPlayer = 0;
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
  }
  @SubscribeMessage('message')
  handleMessageTESTE(client: Socket, payload: string): void {
    console.log(payload);
    console.log(this.charess);
  }
  @SubscribeMessage('palpite')
  handlePalpite(client: Socket, payload: string): void {
    payload=payload.charAt(1)
    for (let index = 0; index < this.charess.length; index++) {
      const element = this.charess[index];
      element.forEach((char, i) => {
        // console.log(payload.charAt(1))
        // console.log('testeeee')
        if (char.val.toUpperCase() === payload.toUpperCase()) {
          // console.log('testeeee')
          this.charess[index][i].shown=true;
          // char.shown = true;
          this.usuarios[this.currentPlayer].score += 100;
        }
      });
    }
    let next = this.currentPlayer + 1;
    if (next >= this.usuarios.length) {
      next = 0;
    }

    // console.log(this.charess)

    this.currentPlayer = next;
    this.updateGame();
  }
  handlePalavras(): void {
    // console.log(this.charess)
    this.server.emit('palavras', this.charess);
  }
  handleUsers(): void {
    this.server.emit('usuarios', this.usuarios);
  }
  handleCurrentUsers(): void {
    this.server.emit('current', this.currentPlayer);
  }

  updateGame() {
    this.handlePalavras();
    this.handleUsers();
    this.handleCurrentUsers();
  }

  afterInit(server: Server) {
    this.usuarios = [];
    this.currentPlayer = 0;
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.usuarios.splice(
      this.usuarios.findIndex((item) => item.id === client.id),
      1
    );
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const usuario = {
      socketId: client.id,
      nome: 'test-' + client.id,
      score: 0,
    };
    if (this.usuarios.length === 0) {
      this.sortearPalavras();
    }
    this.usuarios.push(usuario);
    this.updateGame();
    client.emit('youAre', usuario);
    // console.log(client.id);
    // console.log(this.server.clients());
    // this.server.emit('message',JSON.stringify(this.server))
    // this.server.emit('message2',this.server.allSockets())
  }

  sortearPalavras() {
    this.palavras = [];
    this.charess = [];
    while (this.palavras.length < 3) {
      const num = getRandomInt(0, palavras.length);
      const palavra = palavras[num];
      this.palavras.push(palavra);
      this.charess[this.palavras.length - 1] = palavra.split('').map((item) => {
        return { val: item, shown: false };
      });
    }
  }
}
interface WordChar {
  val: string;
  shown: boolean;
}
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
