import { Component, OnInit, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  firestore: Firestore = inject(Firestore);

  constructor(private router: Router, private util:GameComponent){
    
  }

  ngOnInit(): void {
    
  }

  async newGame(){
    //Start game
    let game = new Game();
    await this.util.addGame(game.toJson());
    const id = this.util.currentId;
    await this.router.navigateByUrl('/game/' + id);
  }

}
