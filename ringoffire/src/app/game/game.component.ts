import { Component, Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  addDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Game } from 'src/models/game';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { onSnapshot } from '@firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { AddingPlayerService } from '../add-player-service/adding-player.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
@Injectable()
export class GameComponent implements OnInit, OnDestroy {
  game: Game = new Game();
  unsubGamesList;
  unsubSingleDoc;
  currentId: string = '';
  firestore: Firestore = inject(Firestore);
  isSmallScreen: boolean = false;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private addingPlayerService: AddingPlayerService) {
    this.unsubGamesList = onSnapshot(this.getGamesRef(), (list: any) => {
      list.forEach((element: any) => {
        //console.log(element.data());
      });
    });

    this.unsubSingleDoc = onSnapshot(
      this.getSingleDocRef('games', '1234'),
      (doc) => {}
    );
  }

  ngOnInit(): void {
    //route gibt url-rest zurück --> dieser ist gleichzeitig die firebase-id und kann
    // so über einen snapshot-listener das zugehörige spiel anzeigen und updaten


    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
    
    this.route.params.subscribe((params) => {
      this.unsubSingleDoc = onSnapshot(
        this.getSingleDocRef('games', params['id']),
        (gameDoc) => {
          const gameData = gameDoc.data();
          this.currentId = params['id'];
          localStorage.setItem('id', this.currentId);
          if (gameData) {
            this.game.currentPlayer = gameData['currentPlayer'];
            this.game.playedCards = gameData['playedCards'];
            this.game.players = (gameData['players']);
            this.game.stack = gameData['stack'];
            this.game.pickCardAnimation = gameData['pickCardAnimation'];
            this.game.currentCard = gameData['currentCard'];
            this.game.avatarId = (gameData['avatarId']);
          }
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.unsubGamesList();
    this.unsubSingleDoc();
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  async addGame(item: {}) {
    await addDoc(this.getGamesRef(), item)
      .catch((err) => {
        console.log('Adding document failed: ' + err);
      })
      .then((docRef: any) => {
        this.currentId = docRef.id;
        console.log('Document written with id: ' + docRef.id);
      });
  }

  async updateGame() {
    if (this.currentId) {
      try {
        let gameDocRef = this.getSingleDocRef('games', this.currentId);
        await updateDoc(gameDocRef, this.game.toJson());
        console.log('Game successfully updated');
      } catch (error) {
        console.error('Error while update:', error);
      }
    } else if (!this.currentId) {
      console.error('currentId is not available');
    }
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 930; // Hier können Sie den gewünschten Schwellenwert für geringere Bildschirmgröße festlegen
  }

  takeCard() {
    if (this.game.players.length < 2) {
      console.log("Please add some players to the game")
    }
    else{
      if (!this.game.pickCardAnimation && this.game.stack.length>0 ) {
        this.playSound('./../assets/audio/cardFlip.mp3')
        this.game.currentCard = this.game.stack.pop()!;
        this.game.pickCardAnimation = true;
        //console.log(this.game.playedCards);
  
        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;
  
        this.updateGame();
  
        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.updateGame();
        }, 1000);
      }
    }
    
  }

  shuffleAndResetCards() {
    this.playSound('./../assets/audio/shuffleCards.mp3')
    if (!this.game.pickCardAnimation) {
      // Füge alle Karten aus playedCards in den Stack ein
      this.game.stack.push(...this.game.playedCards);
  
      // Mische die Karten im Stack zufällig
      this.shuffleArray(this.game.stack);
  
      // Leere playedCards
      this.game.playedCards = [];
  
      // Aktualisiere das Spiel in der Firebase-Datenbank
      this.updateGame();
    }
  }
  
  // Hilfsfunktion zum Mischen eines Arrays (Fisher-Yates-Algorithmus)
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  playSound(soundSrc:any){
    const sound = new Audio();
    sound.src = soundSrc;
    sound.load();
    sound.play();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((player) => {
      if (player) {
        console.log('Received player:', player);
        this.game.players.push(player.name);
        this.game.avatarId.push(player.id);
        this.updateGame();
      }
    });
  }

}
