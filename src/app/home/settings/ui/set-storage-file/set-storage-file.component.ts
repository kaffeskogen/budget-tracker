import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Signal, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { EMPTY, Observable, map, merge, mergeMap, of, startWith } from 'rxjs';
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
  imports: [JsonPipe, AsyncPipe],
  providers: [RouterModule],
  template: `
    <div class="flex">
      <div class="rounded-full border-4 w-6 h-6 border-transparent border-t-blue-500 borde animate-spin"></div>
      {{id$ | async}}
    </div>
  `,
  styles: ``
})
export class SetStorageFileComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);
  storageService = inject(StorageService);
  http = inject(HttpClient);

  id$ = this.route.queryParamMap.pipe(
    mergeMap(params => of(params.get('state') as string) || EMPTY),
    map(state => JSON.parse(state) as GoogleDriveOpenWith),
    map((state) => state.ids[0])
  ) as Observable<string>

  constructor() {
    this.id$
      .pipe(takeUntilDestroyed())
      .subscribe(id => {
        if (!id) return;
        this.storageService.storageProvider.update(() => new GoogleDriveStorageProvider(this.http, id));
        this.router.navigateByUrl('/');
      });
  }

}
