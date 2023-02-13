import { Component, OnInit } from "@angular/core";
import { RankingService } from "src/app/games/memory-game/service/ranking.service";
import { GameService } from "src/app/games/memory-game/service/game.service";
import {DataService} from "src/app/_services/data.service"
import { Router } from '@angular/router';

@Component({
  selector: "app-ranking",
  templateUrl: "./ranking.component.html",
  styleUrls: ["./ranking.component.css"]
})
export class RankingComponent implements OnInit {

  list = []
  // Logic for leaderboard passed to ranking
  // and game service
  constructor(
    public rankingService: RankingService,
    public gameService: GameService,
    public dataService: DataService,
    public router: Router
  ) {}

  ngOnInit() {
    this.dataService.getGameScoreLeaderboard("memorygame", 15, 1).subscribe(
      (data:any) => {
        console.log(data)
        this.list = data;
      },
      error => {
        console.log(error.error);
      }
    )
  }
  play() {
    this.router.navigate(['/start'])
   }
  }
