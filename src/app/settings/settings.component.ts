import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { DialogComponent } from 'src/app/shared/ui/dialog/dialog.component';
import { IconComponent } from '../shared/icons/icon/icon.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule,IconComponent],
  template: `
    <div class="p-8 mb-32">
      <div class="flex flex-col lg:flex-row">
        <div class="grid gap-y-8 w-full max-w-md mr-16">
          <div class="pb-4">

            <a [routerLink]="['/']" class="text-slate-500 hover:text-slate-600 flex items-center">
              <app-icon [size]="14" iconName="ArrowLeft"></app-icon>
              <span class="ml-1">Home</span>
            </a>

            <div class="pb-2">
              <h2 class="text-xl mt-2 mb-2 font-semibold">Settings</h2>
            </div>

            <router-outlet></router-outlet>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class SettingsComponent {

}
