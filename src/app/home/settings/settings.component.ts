import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { GoogleDriveStorageProvider } from 'src/app/shared/data-access/google-drive-storage-provider';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { TransactionsService } from 'src/app/shared/data-access/transactions.service';
import { DialogComponent } from 'src/app/shared/ui/dialog/dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DialogComponent],
  template: `
    <app-dialog (closeDialog)="closeDialog()">
      <ng-container>
        <div class="pb-4">
          <h2 class="text-xl mt-2 mb-4 font-semibold">Settings</h2>
          <h3>Google Drive file id</h3>
          @if(!fileId()) {
            <div class="h-8 animate-pulse bg-slate-500 rounded col-span-2"></div>
          } @else {
            <div class="h-8 rounded col-span-2 px-2 bg-white flex items-center border border-slate-200 place-content-between whitespace-nowrap">
              <span class="truncate">{{fileId()}}</span>
              
              @if(fileLink()) {
                <span><a [href]="fileLink()" target="_blank" class="text-sky-800 text-sm cursor-pointer">View in drive</a></span>
              }
            </div>
          }
        </div>
      </ng-container>
    </app-dialog>
  `,
  styles: ``
})
export class SettingsComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);
  transactionsService = inject(TransactionsService);
  storageService = inject(StorageService);

  googleDriveAppData = toSignal((this.storageService.storageProvider() as GoogleDriveStorageProvider).googleDriveAppData);
  fileId = computed(() => this.googleDriveAppData()?.storageFileId);

  fileLink = computed(() => `https://drive.google.com/file/d/${this.fileId()}/view`);
  
  public closeDialog(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
