import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../_services/data.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  players:any=[]

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.getWinsLeaderboard(10).subscribe(
      (data:any)=>{
        this.players=data
        console.log(data)
      },
      error=>{
        console.log("fail to load the data")
      }
    )
  }
}
