import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-game-window-c4',
  templateUrl: './game-window-c4.component.html',
  styleUrls: ['./game-window-c4.component.css']
})
export class GameWindowC4Component implements OnInit {
  @Input() visible;

  constructor() {}

  ngOnInit() {
  }

}
