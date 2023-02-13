import { Component, OnInit } from '@angular/core';
import { GameService } from "src/app/games/memory-game/service/game.service";

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {

  constructor(public gameService: GameService) {}

  ngOnInit() {}

}
