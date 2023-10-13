import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GameComponent } from '../game/game.component';
import { AddService } from '../add-service/add.service';
import { ActivatedRoute } from '@angular/router';

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
  selectedAvatar: any;
  currentId!: any;

  constructor(
    public dialogRef: MatDialogRef<DialogAddPlayerComponent>,
    private route: ActivatedRoute,
    public gameComponent: GameComponent
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getCurrentId();
    this.getAvatarImages();
  }

  onNoClick() {
    this.dialogRef.close();
  }

  async sendPlayerData() {
    let newPlayer = { name: this.name, avatars: this.selectedAvatar };
    let stringData = JSON.stringify(newPlayer);
    await this.gameComponent.addPlayer(stringData, this.currentId);
  }

  async getCurrentId() {
    this.currentId = localStorage.getItem('id');
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
