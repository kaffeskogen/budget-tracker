import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { TransactionsService } from 'src/app/shared/data-access/transactions.service';
import { IconComponent } from "../../../shared/icons/icon/icon.component";

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [IconComponent],
  template: `
    
    <label class="flex flex-col mt-4 w-full">
      <small class="ml-4">Storage folder id</small>
      @if(!folderId()) {
        <div class="h-8 animate-pulse bg-slate-500 rounded col-span-2"></div>
      } @else {
        <div class="w-full h-8 rounded col-span-2 px-2 bg-white flex items-center border border-slate-200 justify-between">
          <span class="truncate min-w-0">{{folderId()}}</span>
          <a [href]="folderFileLink()" target="_blank" class="ml-1 text-sky-800 text-sm cursor-pointer inline-block flex-shrink-0">View in drive</a>
        </div>
      }
    </label>
    
    <label class="flex flex-col mt-4 w-full">
      <small class="ml-4">Files</small>
      @if(!folderId()) {
        <div class="h-8 animate-pulse bg-slate-500 rounded col-span-2"></div>
      } @else {
        
        @for (period of periods(); track $index) {
          <div class="w-full h-8 rounded col-span-2 px-2 bg-white flex items-center border border-slate-200 justify-between">
            <span class="truncate min-w-0">{{period.name}}</span>
            <div (click)="remove(period)" class="ml-1 text-sky-800 text-sm cursor-pointer inline-block flex-shrink-0"><app-icon iconName="Trash"></app-icon></div>
          </div>
        }
      }
    </label>

  `,
  styles: ``
})
export class GeneralSettingsComponent {

  transactionsService = inject(TransactionsService);
  storageService = inject(StorageService);

  storageProvider = computed(() => this.storageService.storageProvider());
  folderId = toSignal(this.storageProvider().appFolderId$);
  folderFileLink = computed(() => `https://drive.google.com/drive/u/0/folders/${this.folderId()}`);

  periods = toSignal(this.storageProvider().periods$)

  async remove(period: {name: string, id: string}) {
    await this.storageProvider().removeStorageFile(period);
    window.location.reload();

  }

}
