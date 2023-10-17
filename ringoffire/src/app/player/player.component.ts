import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() name: any;
  @Input() playerActive: boolean = false;
  @Input() avatar: any = '';

  ngOnInit(): void {
    
  }

  /**
   * This function returns a random avatar --> currenly not used
   */
  getRandomAvatar(){
    const randomNumber = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
    this.avatar = 'assets/img/avatars_withbg/' + randomNumber + '.png';
  }
}
