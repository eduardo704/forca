import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@forca/api-interfaces';
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
@Component({
  selector: 'forca-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  word = 'banana';
  palavras: Array<string> = [];
  palpite = '';
  chars: WordChar[] = [];
  charess: Array<WordChar[]> = [];

  players = [
    {
      name: 'Edu',
      points: 0,
    },
    {
      name: 'Ric',
      points: 0,
    },
    {
      name: 'Teste',
      points: 0,
    },
  ];

  currentPlayer = 0;

  ngOnInit() {
    this.sortearPalavras();
    this.generateChars();
  }

  sortearPalavras() {
    this.palavras = [];
    this.charess = [];
    while (this.palavras.length < 3) {
      const num = getRandomInt(0, palavras.length);
      const palavra = palavras.splice(num, 1)[0];
      this.palavras.push(palavra);
      this.charess[this.palavras.length - 1] = palavra.split('').map((item) => {
        return { val: item, shown: false };
      });
    }
  }

  palpitar() {
    for (let index = 0; index < this.charess.length; index++) {
      const element = this.charess[index];
      element.forEach((char) => {
        if (char.val.toUpperCase() === this.palpite.toUpperCase()) {
          char.shown = true;
          this.players[this.currentPlayer].points += 100;
        }
      });
    }
    let next = this.currentPlayer + 1;
    if (next >= this.players.length) {
      next = 0;
    }

    this.currentPlayer = next;
  }

  generateChars() {
    this.chars = this.word.split('').map((item) => {
      return { val: item, shown: false };
    });
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
