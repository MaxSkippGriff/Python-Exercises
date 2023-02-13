import { Component, OnInit } from '@angular/core';
import { GameService } from "src/app/games/memory-game/service/game.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
})
export class GameplayComponent implements OnInit {
  // Gameplay logic passed to gameservice
 constructor(private gameService: GameService, private router: Router) {}

 ngOnInit() {
   // Navigate back to start 
   if (!this.gameService.playerName) {
     this.router.navigate(["start"]);
   }
 }
}
