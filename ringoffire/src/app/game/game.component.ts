import {
  Component,
  Injectable,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
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

  /**
   *
   * @param route : ref for routing module
   * @param dialog : ref for dialog module
   * @param addingPlayerService : ref for addingPlayerService
   */
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private addingPlayerService: AddingPlayerService
  ) {
    /**
     * Initializing unsubGamesList and unsubSingleDoc
     */
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

  /**
   * Screensize checking for possible css adjustments and fetching of game data
   */
  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });

    this.getCurrentGame();
  }

  /**
   * This function fetches the game data according to the firebase id
   */
  getCurrentGame() {
    this.route.params.subscribe((params) => {
      this.unsubSingleDoc = onSnapshot(
        this.getSingleDocRef('games', params['id']),
        (gameDoc) => {
          const gameData = gameDoc.data();
          this.currentId = params['id'];
          localStorage.setItem('id', this.currentId);
          if (gameData) {
            this.setGameData(gameData);
          }
        }
      );
    });
  }

  /**
   * 
   * @param gameData : Object from firebase holding the game data of the current game
   */
  setGameData(gameData: any) {
    this.game.currentPlayer = gameData['currentPlayer'];
    this.game.playedCards = gameData['playedCards'];
    this.game.players = gameData['players'];
    this.game.stack = gameData['stack'];
    this.game.pickCardAnimation = gameData['pickCardAnimation'];
    this.game.currentCard = gameData['currentCard'];
    this.game.avatarId = gameData['avatarId'];
  }

  /**
   * Stopping listeners on destroy
   */
  ngOnDestroy(): void {
    this.unsubGamesList();
    this.unsubSingleDoc();
  }

  /**
   * 
   * @returns {collection}: collection reference of the games from firebase
   * This function returns a reference of the games collection from firebase
   */
  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  /**
   * 
   * @returns {doc}: document reference of single games from firebase specified by id
   * This function returns a reference of a single game from firebase specified by id
   */
  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  /**
   * 
   * @param item {object}: A new game object
   * This function adds a new game document to the firestore
   */
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

  /**
   * This function updates the current game state according to the id
   */
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

  /**
   * This function holds a boolean to the current screen size and checks if it is greater or lower than 930px
   */
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 930; // Hier können Sie den gewünschten Schwellenwert für geringere Bildschirmgröße festlegen
  }

  /**
   * This function handles the behaviour after taking a card
   */
  takeCard() {
    if (this.game.players.length < 2) {
      console.log('Please add some players to the game');
    } else {
      if (!this.game.pickCardAnimation && this.game.stack.length > 0) {
        this.getCardActions()
      }
    }
  }

  /**
   * This function handles the single actions after taking a card
   */
  getCardActions(){
    this.playSound('./assets/audio/cardFlip.mp3');
        this.game.currentCard = this.game.stack.pop()!;
        this.game.pickCardAnimation = true;
        this.setCurrentPlayer();
        this.updateGame();
        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.updateGame();
        }, 1000);
  }

  /**
   * This function handles the current player state after taking a card
   */
  setCurrentPlayer(){
    this.game.currentPlayer++;
    this.game.currentPlayer =
    this.game.currentPlayer % this.game.players.length;
  }

  /**
   * This function handles the shuffling after all cards have been played out. It pushes all cards from the played cards
   * into the stack, shuffles them and sets the played cards stack to 0.
   */
  shuffleAndResetCards() {
    this.playSound('./assets/audio/shuffleCards.mp3');
    if (!this.game.pickCardAnimation) {
      this.game.stack.push(...this.game.playedCards);
      this.shuffleArray(this.game.stack);
      this.game.playedCards = [];
      this.updateGame();
    }
  }

  /**
   * 
   * @param array {array}: Card array
   * This function takes all elements of the array and mixes them (Fisher-Yates-Algorithm)
   */
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * 
   * @param soundSrc {string}: Path to sound file
   * This function plays the sound out of a certain path
   */
  playSound(soundSrc: any) {
    const sound = new Audio();
    sound.src = soundSrc;
    sound.load();
    sound.play();
  }

  /**
   * This function handles the opening and closing of the dialog window. It listens to its transferred player
   * object and pushes the values into firestore documents
   */
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
