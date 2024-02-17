import { Injectable } from '@angular/core';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token?: string;

  login() {
    const auth = new Auth({
      baseUrl: 'https://accounts.google.com/o/oauth2/auth',
      queryParams: {
        client_id: '',
        scope: '',
      }
    });
    auth.getToken().then((token) => {
      this.token = token;
      console.log('TOKEN', token);
    });
  }

}
