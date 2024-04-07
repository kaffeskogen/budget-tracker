import { Injectable, computed, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, tap } from 'rxjs';
import { AppStateService } from '../data-access/app-state.service';
import { Router } from '@angular/router';
import { StorageService } from '../data-access/storage.service';
import { GoogleDriveStorageProvider } from '../data-access/google-drive-storage-provider';
import { HttpClient } from '@angular/common/http';

export interface Oauth2TokenResponse {
  access_token: string;
  expires_in: number;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  appState = inject(AppStateService);
  router = inject(Router);
  storageService = inject(StorageService);
  http = inject(HttpClient);

  private tokenResponse = toSignal<Oauth2TokenResponse>(fromEvent<MessageEvent>(window, 'message')
    .pipe(
      map(event => event.data satisfies Oauth2TokenResponse),
      tap(response => {
        if (response.access_token) {
          this.appState.storageStrategy.update(() => 'google-drive');
          this.storageService.storageProvider.update(() => new GoogleDriveStorageProvider(this.http, response));
          const routerParam = this.router.parseUrl(this.router.url).queryParamMap.get('redirect');
          this.router.navigateByUrl(routerParam || '/');
        }
      })
    ));

  token = computed(() => this.tokenResponse()?.access_token);
  loggedIn = computed(() => !!this.token());

  async login() {
    const endpoint = 'https://accounts.google.com/o/oauth2/auth';
    const params = {
      client_id: environment.oauth2.google_client_id,
      scope: [
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.install'
      ].join(' '),
      response_type: 'token',
      redirect_uri: window.location.origin + '/oauth2.html',
    };

    const url = endpoint + '?' + new URLSearchParams(params).toString();
    window.open(url, 'kaffeskogen-oauth', 'popup,height=570,width=520');
  }

}
