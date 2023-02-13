import { Component, OnInit, Input } from "@angular/core";
import { Card } from "src/app/games/memory-game/cards/card.class";
import { GameService } from "src/app/games/memory-game/service/game.service";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"]
})
export class CardComponent implements OnInit {
  @Input() card: Card;

  constructor(public gameService: GameService) {}

  ngOnInit() {}
}
