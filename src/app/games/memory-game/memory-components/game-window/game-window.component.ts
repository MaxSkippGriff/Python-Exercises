import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-game-window',
  templateUrl: './game-window.component.html',
  styleUrls: ['./game-window.component.css']
})
export class GameWindowComponent implements OnInit {
  @Input() visible;

  constructor() {}

  ngOnInit() {
  }

}
