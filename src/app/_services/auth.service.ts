import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private USER_AUTH_API = "http://localhost:3000/api/users";

  constructor(private httpClient: HttpClient) {}

  register(userData: any)
  {
    return this.httpClient.post(this.USER_AUTH_API, userData)
  }

  login(credentials: any)
  {
    return this.httpClient.post(this.USER_AUTH_API+'/session', credentials)
  }
  signout(username: String){
    return this.httpClient.delete(this.USER_AUTH_API+'/session')
  }
}
