import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Player {
  public name: string;
  public id: number;

  constructor() {
    this.name = "";
    this.id = 0;
  }
}

export class AddingPlayerService {
  //private players: Player[] = [];  --> potentially for more game information to be transferred

  /* addPlayer(player: Player) {
    this.players.push(player);
  } */

  /* getPlayers() {
    return this.players;
  } */
}
