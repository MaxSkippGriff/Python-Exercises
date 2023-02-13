import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ConnectFourComponent } from 'src/app/games/connect-4/connect-four/connect-four.component';

@Component({
  selector: 'app-gameplay-connect-four',
  templateUrl: './gameplay-connect-four.component.html',
})
export class GameplayConnectFourComponent implements OnInit {
  // Gameplay logic passed to gameservice
  constructor(private connectFour: ConnectFourComponent, private router: Router) { }

  ngOnInit() {
    
    // Navigate back to start 
    if (!this.connectFour.playerName) {
      this.router.navigate(["connect4start"]);
    }
  }

}