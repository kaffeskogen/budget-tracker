import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { ItemMetadata } from 'src/app/shared/interfaces/AppStorageProvider';

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
        <p class="mb-1">Confirm you'd like to use the following file for storage</p>
        <div class="bg-gray-300 px-4 py-2 rounded border border-gray-400 font-mono">
          {{fileMetadata()?.name}} <br/>
          {{fileId()}}
        </div>
        <div class="flex justify-end">
          <button [routerLink]="['..']" type="button" class="rounded px-4 py-2 mt-4 mr-2 border border-slate-400 hover:bg-gray-100 text-gray-800 bg-white">Cancel</button>
          <button type="button" class="rounded px-4 py-2 mt-4 border bg-sky-700 hover:bg-sky-800 text-white" (click)="confirm()">Confirm</button>
        </div>
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
  storageProvider = this.storageService.storageProvider;
  http = inject(HttpClient);

  state = signal<'loading' | 'error' | 'confirmation' | 'success'>('loading');
  message = signal<string | null>(null);
  fileId = signal<string | null>(null);
  fileMetadata = signal<ItemMetadata | null>(null);

  async ngOnInit(): Promise<void> {
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

    this.fileId.update(() => firstId);
    const metadata = await this.storageProvider().getFileMetadata(firstId);
    this.fileMetadata.update(() => metadata)

    this.state.update(() => 'confirmation')

  }

  async confirm() {
    const fileId = this.fileId();
    const fileMetadata = this.fileMetadata();

    const storageProvider = this.storageProvider();

    if (!fileId || !fileMetadata?.name) {
      return;
    }

    this.state.update(() => 'loading');
    
    try {

      if (storageProvider.isFolder(fileMetadata)) {
        await this.storageProvider().setAppStorageFolder({id: fileId, name: fileMetadata.name});
      } else {
        await this.storageProvider().addStorageFile({id: fileId, name: fileMetadata.name});
      }

      this.message.update(() => 'Completed!');
      this.state.update(() => 'success');

    } catch (e: any) {
      const errorMessage = e?.error?.message || e?.error || e?.message || 'Unknown error';
      this.message.update(() => errorMessage);
      this.state.update(() => 'loading');
    }
  }

}
