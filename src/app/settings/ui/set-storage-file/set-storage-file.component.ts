import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router, RouterLink, RouterModule } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable, Observer, Scheduler, Subject, concatMap, delay, forkJoin, map, merge, mergeMap, of, scheduled, skipUntil, startWith, throwError, zip } from 'rxjs';
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
    @switch (state()) {
      @case ('loading') {    
        <div class="flex">
          <div class="rounded-full border-4 w-6 h-6 border-transparent border-t-blue-500 borde animate-spin"></div>
          {{state()}}
        </div>
      } @case ('error') {
        <div class="bg-red-200 px-4 py-2 rounded border border-red-300 font-mono">{{message()}}</div>
        <a [routerLink]="['..']" class="text-sky-600 block mt-2">Go back</a>
      } @case ('confirmation') {
        <div class="bg-yellow-200 px-4 py-2 rounded border border-yellow-300 font-mono">{{message()}}</div>
        <button (click)="confirm()" class="bg-yellow-500 text-white px-4 py-2 rounded mt-2">Yes, I want to use this file</button>
      } @case ('success') {
        <div class="bg-green-200 px-4 py-2 rounded border border-green-300 font-mono">{{message()}}</div>
        <a [routerLink]="['..']" class="text-sky-600 block mt-2">Go back</a>
      }
    }
  `,
  styles: ``
})
export class SetStorageFileComponent implements OnInit {

  route = inject(ActivatedRoute);
  router = inject(Router);
  storageService = inject(StorageService);
  storageProvider = this.storageService.storageProvider as WritableSignal<GoogleDriveStorageProvider>;
  http = inject(HttpClient);

  state = signal<'loading'|'error'|'confirmation'|'success'>('loading');
  message = signal<string|null>(null);

  ngOnInit(): void {
    const state = this.route.snapshot.queryParamMap.get('state');
    if (!state) {
      this.state.update(() => 'error');
      this.message.update(() => 'Url parameter `state` missing');
      return;
    }

    let params: GoogleDriveOpenWith;
    try {
      params = JSON.parse(state) as GoogleDriveOpenWith;
    } catch (e) {
      this.state.update(() => 'error');
      this.message.update(() => 'Url parameter `state` is not valid JSON');
      return;
    }

    const firstId = params.ids[0];
    if (!firstId) {
      this.state.update(() => 'error');
      this.message.update(() => 'No file id provided');
      return;
    }

    
  }

  confirm() {
    this.state.update(() => 'confirmation');
  }

}
