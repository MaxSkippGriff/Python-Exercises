import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-bgm',
  templateUrl: './bgm.component.html',
  styleUrls: ['./bgm.component.css'],
})
export class BgmComponent implements OnInit {
  public bgm = new Audio("../../../assets/audio/Sunshine_Kiss.mp3");
  constructor() {
   }

  controlbgm(){
    if(this.bgm.paused){
      console.log("trying to play bgm");
      this.bgm.play();
      this.bgm.loop = true;
    }else{
      console.log("trying to pause bgm");
      this.bgm.pause();
    }
  }

  ngOnInit(): void {
  }

}
