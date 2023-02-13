import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user=this.tokenStorageService.getUser()

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
  }
  signout (e: { preventDefault: () => void; }) {
    e.preventDefault()
    this.authService.signout(this.user).subscribe(
      data => {
        this.tokenStorageService.signOut()
        this.router.navigate(['/login'])
      },
      error => {
        window.alert('Log out failed. Please try again')
      })
  }

}
