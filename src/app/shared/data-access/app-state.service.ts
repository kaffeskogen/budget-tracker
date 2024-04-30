import { Injectable, Injector, WritableSignal, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';
import { GoogleDriveStorageProvider } from './google-drive-storage-provider';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
export type StorageStrategy = 'unselected'|'in-memory'|'google-drive';

interface AppState {
  lastSelectedFormattedDate: WritableSignal<string>;
  storageStrategy: WritableSignal<StorageStrategy>;
}

const defaultFormattedDate = new Intl.DateTimeFormat('sv-SE').format(new Date());

@Injectable({
  providedIn: 'root'
})
export class AppStateService implements AppState {

  storageService = inject(StorageService);
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  injector = inject(Injector);

  lastSelectedFormattedDate = signal<string>(defaultFormattedDate);
  storageStrategy = signal<StorageStrategy>('unselected');

  constructor() {
    toObservable(this.storageStrategy).subscribe(strategy => {
      if (strategy === 'google-drive') {
        const service = this.injector.get(GoogleDriveStorageProvider);
        // service.loadAppStorage();
        this.storageService.storageProvider.update(() => service);
        
        const routerParam = this.route.snapshot.queryParamMap.get('redirect');
        this.router.navigateByUrl(routerParam || '/');
      }
    });
  }


}
