import { Component, OnInit } from '@angular/core';
import { ConnectFourComponent } from '../../connect-4/connect-four/connect-four.component'
import { Router } from "@angular/router";
import { GameplayConnectFourComponent } from '../gameplay-connect-four/gameplay-connect-four.component';

@Component({
  selector: 'app-start-connect-four',
  templateUrl: './start-connect-four.component.html',
  styleUrls: ['./start-connect-four.component.css']
})
export class StartConnectFourComponent {
  // Logic for start page passed to gameservice.
  constructor(public connectFour: ConnectFourComponent, public router: Router) { }

  // Game starts one the player has entered
  // his/her name
  startGame() {
    if (this.connectFour.playerName && this.connectFour.playerName.trim()) {
      this.router.navigate(["connect4_gameplay"]);
      console.log(this.connectFour.playerName);
    }
  }
}
