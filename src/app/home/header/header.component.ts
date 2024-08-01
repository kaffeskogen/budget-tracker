import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { OutlineIconsModule } from '@dimaslz/ng-heroicons';
import { StorageService } from 'src/app/shared/data-access/storage.service';

@Component({
    selector: 'app-header',
    template: `
  <div class="flex place-content-between items-center">
    <div class="flex items-center">
      <div class="rounded-full w-12 h-12 bg-amber-500 mr-4 border border-amber-200 overflow-hidden">
        <img [src]="userProfile()?.photoUrl">
      </div>
      <div class="flex flex-col content-between">
        <div class="text-sm text-slate-500">Welcome</div>
        <div class="font-bold">{{userProfile()?.name}}</div>
      </div>
    </div>
    <button class="rounded-md bg-white p-1 hover:bg-slate-100 active:bg-white cursor-pointer" [routerLink]="['/settings']">
      <cog-6-tooth-outline-icon [size]="18"></cog-6-tooth-outline-icon>
    </button>
  </div>
  `,
    standalone: true,
    imports: [OutlineIconsModule, RouterLink, JsonPipe]
})
export class HeaderComponent {
  storageService = inject(StorageService);
  storageProvider = computed(() => this.storageService.storageProvider());
  userProfile = toSignal(this.storageProvider().userProfile$);

}
