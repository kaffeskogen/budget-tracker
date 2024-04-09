import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Signal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router, RouterLink, RouterModule } from '@angular/router';
import { EMPTY, Observable, Scheduler, delay, map, merge, mergeMap, of, scheduled, startWith, throwError } from 'rxjs';
import { GoogleDriveStorageProvider } from 'src/app/shared/data-access/google-drive-storage-provider';
import { StorageService } from 'src/app/shared/data-access/storage.service';

interface GoogleDriveOpenWith {
  ids: string[],
  action: 'open' | 'create',
  userId: string,
  resourceKeys: unknown
}
// https://localhost:4200/settings/set-storage-file?state={"ids":["1UjV1UjNGBlm9bBgcH17h1AgqXxaXjUeA"],"action":"open","userId":"109311946425271578787","resourceKeys":{}}
@Component({
  selector: 'app-set-storage-file',
  standalone: true,
  imports: [JsonPipe, AsyncPipe, RouterLink],
  providers: [RouterModule],
  template: `
    @switch (loadingState()) {
      @case ('loading') {    
        <div class="flex">
          <div class="rounded-full border-4 w-6 h-6 border-transparent border-t-blue-500 borde animate-spin"></div>
          {{loadingState()}}
        </div>
      } @case ('error') {
        <div class="bg-red-200 px-4 py-2 rounded border border-red-300 font-mono">{{message()}}</div>
        <a [routerLink]="['..']" class="text-sky-600 block mt-2">Go back</a>
      }
    }
  `,
  styles: ``
})
export class SetStorageFileComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);
  storageService = inject(StorageService);
  http = inject(HttpClient);

  loadingState = signal<'loading'|'error'|'success'>('loading');
  message = signal<string|null>(null);

  id$ = this.route.queryParamMap.pipe(
    delay(1000),
    mergeMap(params => of(params.get('state') as string|undefined)),
    mergeMap(state => state ? of(state) : throwError(() => new Error('Url parameter `state` missing'))),
    map(state => JSON.parse(state) as GoogleDriveOpenWith),
    map((state) => state.ids[0])
  ) as Observable<string>

  constructor() {
    this.id$
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: id => {
          this.storageService.storageProvider.update(() => new GoogleDriveStorageProvider(this.http, id));
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.loadingState.update(() => 'error');
          this.message.update(() => err.message);
        }
      });
  }

}
