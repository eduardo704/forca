import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'forca-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  palpite = '';
  charess: Array<WordChar[]> = [];

  players: Array<any> = [];
  eu: any;
  constructor(private gameService: GameService) {}
  currentPlayer = 0;

  ngOnInit() {
    this.gameService.palavras.subscribe((teste) => {
      this.charess = teste;
    });
    this.gameService.usuarios.subscribe((teste) => {
      this.players = teste;
    });
    this.gameService.current.subscribe((teste) => {
      this.currentPlayer = teste;
    });
    this.gameService.youAre.subscribe((teste) => {
      console.log(teste);
      this.eu = teste;
    });
  }

  ngOnDestroy() {
    this.gameService.disconect();
  }

  palpitar() {
    this.gameService.palpitar(this.palpite);
  }
}

interface WordChar {
  val: string;
  shown: boolean;
}
