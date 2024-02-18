import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Oauth2 } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token?: string;

  login() {
    const auth = new Oauth2({
      baseUrl: 'https://accounts.google.com/o/oauth2/auth',
      queryParams: {
        client_id: environment.oauth2.google_client_id,
        scope: 'https://www.googleapis.com/auth/drive.appdata',
      }
    });
    auth.getToken().then((token) => {
      this.token = token;
      console.log('TOKEN', token);
    });
  }

}
