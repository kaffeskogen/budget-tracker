import { Injectable, Injector, computed, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, tap } from 'rxjs';
import { AppStateService } from '../data-access/app-state.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  route = inject(ActivatedRoute);
  router = inject(Router);
  storageService = inject(StorageService);
  http = inject(HttpClient);
  injector = inject(Injector);


  private tokenResponse = toSignal<Oauth2TokenResponse>(fromEvent<MessageEvent>(window, 'message')
    .pipe(
      map(event => event.data satisfies Oauth2TokenResponse),
      tap(response => {
        if (response.access_token) {
          this.appState.storageStrategy.update(() => 'google-drive');
          const service = this.injector.get(GoogleDriveStorageProvider);
          // service.loadAppStorage();
          this.storageService.storageProvider.update(() => service);
          const routerParam = this.route.snapshot.queryParamMap.get('redirect');
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
