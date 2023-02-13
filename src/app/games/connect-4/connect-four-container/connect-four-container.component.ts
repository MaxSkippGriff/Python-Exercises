import { Component, OnInit } from '@angular/core';
import { ConnectFourComponent } from '../connect-four/connect-four.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connect-four-container',
  templateUrl: './connect-four-container.component.html',
  styleUrls: ['./connect-four-container.component.css']
})
export class ConnectFourContainerComponent implements OnInit {

  constructor(public connectFour: ConnectFourComponent, public router: Router) { }

  ngOnInit(): void {
  }

  backToHome(){
    this.router.navigateByUrl('/home');
  }
}
