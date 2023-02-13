import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm = {
    email: '',
    password: '',
    username: ''
  }
  errMsg = ''

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {}

  signup(): void{
    const formData = this.signUpForm
    this.authService.register(formData).subscribe(
      (data:any)=>{
        this.errMsg = ''
        this.tokenStorageService.saveToken(data.token)
        this.tokenStorageService.saveUser(data.user)
        this.router.navigate(['/home'])
      },
      error=>{
        if(error.status === 409) {
          this.errMsg ="Username already exists"
        }
      }
    )
  }
}
