import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoogleDriveStorageProvider } from 'src/app/shared/data-access/google-drive-storage-provider';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { TransactionsService } from 'src/app/shared/data-access/transactions.service';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [],
  template: `
    
    <label class="flex flex-col mt-4 w-full">
      <small class="ml-4">Google drive file id</small>
      @if(!fileId) {
        <div class="h-8 animate-pulse bg-slate-500 rounded col-span-2"></div>
      } @else {
        <div class="w-full h-8 rounded col-span-2 px-2 bg-white flex items-center border border-slate-200 justify-between">
          <span class="truncate min-w-0">{{fileId}}</span>
          <a [href]="fileLink" target="_blank" class="ml-1 text-sky-800 text-sm cursor-pointer inline-block flex-shrink-0">View in drive</a>
        </div>
      }
    </label>
  `,
  styles: ``
})
export class GeneralSettingsComponent {

  transactionsService = inject(TransactionsService);
  storageService = inject(StorageService);

  storageProvider = computed(() => this.storageService.storageProvider() as GoogleDriveStorageProvider);

  fileId?: string;
  fileLink?: string;

  constructor() {
    this.storageProvider().fileId$.pipe(
      takeUntilDestroyed()
    ).subscribe(fileId => {
      if (!fileId) return;
      this.fileId = fileId;
      this.fileLink = `https://drive.google.com/file/d/${fileId}/view`;
    });
  }
}
