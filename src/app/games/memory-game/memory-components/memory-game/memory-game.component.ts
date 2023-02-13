/*
   TO DO: Add game service
*/

import { Component, OnInit } from '@angular/core';
import { GameService } from "src/app/games/memory-game/service/game.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.css']
})
export class MemoryGameComponent implements OnInit {

  constructor(public gameService: GameService, public router: Router) {}

  ngOnInit() {}

  addFriend(e: { preventDefault: () => void; }){
    e.preventDefault()
    this.gameService.addFriend()
  }

  backToHome(){
    this.router.navigateByUrl('/home');
  }
}
