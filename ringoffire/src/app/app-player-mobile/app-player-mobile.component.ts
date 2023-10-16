import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-mobile',
  templateUrl: './app-player-mobile.component.html',
  styleUrls: ['./app-player-mobile.component.scss']
})
export class AppPlayerMobileComponent {
  @Input() name: any;
  @Input() playerActive: boolean = false;
  @Input() avatar: any = '';

  ngOnInit(): void {
    
  }


  getRandomAvatar(){
    const randomNumber = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
    this.avatar = 'assets/img/avatars_withbg/' + randomNumber + '.png';
  }
}
