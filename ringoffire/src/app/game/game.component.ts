import { Component, Injectable, OnInit, inject } from '@angular/core';
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

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
@Injectable()
export class GameComponent implements OnInit {
  game: Game = new Game();

  unsubGamesList;
  unsubSingleDoc;
  currentId: string = '';
  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
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
            this.game.players = this.getNames(gameData['players']);
            this.game.stack = gameData['stack'];
            this.game.pickCardAnimation = gameData['pickCardAnimation'];
            this.game.currentCard = gameData['currentCard'];
            this.game.avatarId = this.getAvatars(gameData['players']);;
          }
        }
      );
    });
  }

  getNames(playersList: any) {
    const namesArray = playersList.map((jsonString: string) => {
      const jsonObject = JSON.parse(jsonString);
      return jsonObject.name;
    });
    return namesArray;
  }

  getAvatars(playersList: any){
    const avatarArray = playersList.map((jsonString: string) => {
      const jsonObject = JSON.parse(jsonString);
      return jsonObject.avatars;
    });
    return avatarArray;
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

  takeCard() {
    if (!this.game.pickCardAnimation) {
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

  async addPlayer(playerData: string, id: string) {
    this.currentId = id;
    console.log('addPlayer executed, playerData:', playerData);
    console.log('currentID:', this.currentId);
    this.game.players.push(playerData);

    await this.updateGame();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(() => {
      //name in subscription!?
      /* if (name && name.length > 0) {
        this.game.players.push(name);
        this.updateGame();
      } */
    });
  }
}
