import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  checkLoginForm  = {
    username: '',
    password: ''
  }
  errMsg = ''
  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
  }

  login(){
    const formData = this.checkLoginForm 
    this.authService.login(formData).subscribe(
      (data:any)=>{
        this.errMsg = ''
        this.tokenStorageService.saveToken(data.token)
        this.tokenStorageService.saveUser(data.user)
        this.router.navigate(['/home'])
      },
      error=>{
        if(error.status === 401) {
          this.errMsg ="invalid username/password"
        }
      }
    )

  }
}
