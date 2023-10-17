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

  mainTheme: any = new Audio();

  constructor(private router: Router, private util:GameComponent){
    
  }

  ngOnInit(): void {
    this.playTheme();
  }

  ngOnDestroy(): void {
    this.mainTheme.pause();
  }

  /**
   * This function handles the main theme playing
   */
  playTheme(){
    this.mainTheme.src = "./../assets/audio/main-theme.mp3";
    this.mainTheme.load();
    this.mainTheme.loop = true;
    this.mainTheme.play();
  }

  /**
   * This function handles the initialization of a new game object and forwards to the specified url
   */
  async newGame(){
    
    let game = new Game();
    await this.util.addGame(game.toJson());
    const id = this.util.currentId;
    await this.router.navigateByUrl('/game/' + id);
  }

}
