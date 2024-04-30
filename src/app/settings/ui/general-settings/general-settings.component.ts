import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, of, switchMap, tap } from 'rxjs';
import { GoogleDriveAppData, GoogleDriveStorageProvider } from 'src/app/shared/data-access/google-drive-storage-provider';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { TransactionsService } from 'src/app/shared/data-access/transactions.service';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [],
  template: `
    
    <label class="flex flex-col mt-4">
      <small class="ml-4">Google drive file id</small>
      @if(!fileId) {
        <div class="h-8 animate-pulse bg-slate-500 rounded col-span-2"></div>
      } @else {
        <div class="h-8 rounded col-span-2 px-2 bg-white flex items-center border border-slate-200 place-content-between whitespace-nowrap">
          <span class="truncate">{{fileId}}</span>
          <span><a [href]="fileLink" target="_blank" class="text-sky-800 text-sm cursor-pointer">View in drive</a></span>
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
      console.log('File id', fileId);
      if (!fileId) return;
      this.fileId = fileId;
      this.fileLink = `https://drive.google.com/file/d/${fileId}/view`;
    });
  }
}
