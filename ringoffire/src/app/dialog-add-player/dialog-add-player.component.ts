import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameComponent } from '../game/game.component';
import { AddingPlayerService, Player } from '../add-player-service/adding-player.service';

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

  constructor(
    public dialogRef: MatDialogRef<DialogAddPlayerComponent>,
    private addingPlayerService: AddingPlayerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getAvatarImages();
  }

  async setPlayer() {
    this.player.name = this.name;
    this.player.id = this.selectedAvatar;
    //this.addingPlayerService.addPlayer(this.player); // potentially for later expansion of player class
    this.dialogRef.close(this.player); //beim Schließen des Dialogs wird das erstellte player-Objekt returned
    //die game-component kann dann durch die subscription darauf zugreifen
  }

  onNoClick() {
    this.dialogRef.close();
  }

  getAvatarImages() {
    for (let i = 1; i < 51; i++) {
      this.avatars.push({
        value: i,
        viewValue: '/assets/img/avatars_withbg/' + i + '.png',
        name: this.names[i - 1],
      });
    }
  }

 

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
}
