import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameComponent } from '../game/game.component';
import {
  AddingPlayerService,
  Player,
} from '../add-player-service/adding-player.service';

interface Avatar {
  value: number;
  viewValue: any;
  name: string;
}
@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss'],
})
export class DialogAddPlayerComponent implements OnInit {
  name: string = '';
  avatars: Avatar[] = [];
  selectedAvatar: number = 0;
  player: Player = new Player();

  names = [
    'Elowen',
    'Aldric',
    'Thorn',
    'Maelis',
    'Caelan',
    'Brynn',
    'Eowyn',
    'Lysander',
    'Rowena',
    'Crispin',
    'Seraphina',
    'Oswin',
    'Lorelei',
    'Cassian',
    'Elysia',
    'Aurelius',
    'Ilythia',
    'Orin',
    'Morgana',
    'Finnian',
    'Genevieve',
    'Peregrine',
    'Elara',
    'Quinlan',
    'Seraphim',
    'Rhiannon',
    'Cedric',
    'Ondine',
    'Eadric',
    'Isolde',
    'Thaddeus',
    'Aurora',
    'Gawain',
    'Artemis',
    'Calista',
    'Gareth',
    'Thalassa',
    'Cyprian',
    'Eulalia',
    'Drystan',
    'Morgause',
    'Ezrael',
    'Eirian',
    'Faelan',
    'Sylvaine',
    'Lorcan',
    'Morrigan',
    'Fiora',
    'Finlo',
    'Danilo',
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogAddPlayerComponent>,
    private addingPlayerService: AddingPlayerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getAvatarImages();
  }

  /**
   * This function sets the values of the player object an returns the object to the corresponding component
   */
  async setPlayer() {
    this.player.name = this.name;
    this.player.id = this.selectedAvatar;
    //this.addingPlayerService.addPlayer(this.player); // potentially for later expansion of player class
    this.dialogRef.close(this.player);
  }

  /**
   * This function handles the case of a user pressing the "No thanks" button in the dialog
   */
  onNoClick() {
    this.dialogRef.close();
  }

  /**
   * This function iterates through the avatar pictures folder and pushes the objects into the avatars-array
   */
  getAvatarImages() {
    for (let i = 1; i < 51; i++) {
      this.avatars.push({
        value: i,
        viewValue: 'assets/img/avatars_withbg/' + i + '.png',
        name: this.names[i - 1],
      });
    }
  }
}
