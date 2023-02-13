import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../_services/data.service';
import { TokenStorageService } from '../../_services/token-storage.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username=''
  currentUser =''
  friends=[]
  games:any=[]
  info:any={}
  editing:boolean = false
  isVisitor:boolean = false

  constructor(
    private dataService: DataService,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.isVisitor = false
    this.username= this.tokenStorageService.getUser()
    this.loadData(this.username)
  }

  loadData(user:any){
    this.currentUser = user
    this.dataService.getUserInfo(user).subscribe(
      (data:any) => {
        this.info=data
      },
      error=>{
        console.log("fail to load the personal info")
      }
    )
    this.dataService.getFriends(user).subscribe(
      (data:any)=>{
        this.friends=data.friends
      },
      error=>{
        console.log("fail to load the friendlist")
        console.log(error)
      }
    )
    this.dataService.getGameHistory(user, 10).subscribe(
      (data:any)=>{
        this.games=data.gamesPlayed.reverse()
        this.games.forEach((element:any) => {
          element.date = element.date.substring(5, 10)
        });
      },
      error=>{
        console.log("fail to load the game history")
      }
    )
  }
  viewFriend(friend: any){
    this.isVisitor = true
    this.loadData(friend)
  }
  backToProfile(){
    this.isVisitor = false
    this.loadData(this.username)
  }
  edit(e: { preventDefault: () => void; }){
    e.preventDefault()
    this.editing=true
  }
  save(e: { preventDefault: () => void; }){
    e.preventDefault()
    this.editing=false
    this.dataService.updateUserInfo(this.currentUser, this.info).subscribe(
      (data:any) => {
        console.log(data.result)
      },
      error=>{
        console.log("error.error")
      }
    )
  }
}
