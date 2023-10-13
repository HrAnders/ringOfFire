import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddService {

  constructor() {}

  private playersSubject = new BehaviorSubject<string[]>([]);
  players$ = this.playersSubject.asObservable();

  addPlayer(playerData: string) {
    console.log("addPlayer executed, playerData:", playerData);
    
  }
}
