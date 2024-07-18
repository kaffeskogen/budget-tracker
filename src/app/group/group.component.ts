import { NgIf, NgStyle, NgFor } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { IconComponent } from '../shared/icons/icon/icon.component';
import { CurrencyFormattedPipe } from '../shared/pipes/currency-formatted.pipe';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { TransactionsService } from '../shared/data-access/transactions.service';
import { Group } from '../shared/interfaces/Group';
import { toSignal } from '@angular/core/rxjs-interop';
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { OutlineIconsModule } from '@dimaslz/ng-heroicons';
import { GroupSettingsComponent } from './ui/group-settings/group-settings.component';
import { GraphComponent } from '../shared/ui/graph/graph.component';
import { DialogComponent } from '../shared/ui/dialog/dialog.component';

export interface TransactionsGroupState {
  error: string | null;
  status: 'loading' | 'success' | 'error';
}

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [NgIf, NgStyle, NgFor, RouterLink, IconComponent, CurrencyFormattedPipe, RouterModule, CdkMenuTrigger, CdkMenu, CdkMenuItem, OutlineIconsModule, GroupSettingsComponent, GraphComponent, DialogComponent],
  template: `
    <div class="p-8 mb-32">
      <div class="flex flex-col lg:flex-row">
        <div class="w-full max-w-md mr-16">

          <div class="pl-2">
            <a routerLink="/" class="flex items-center"><app-icon iconName="ArrowLeft" class="pr-2" [size]="16"></app-icon> Go back home</a>
          </div>

          <div class="p-4 flex items-end w-full">

            <div class="text-xl font-bold mr-2" [ngStyle]="{color: group()?.color ?? 'blue'}" data-qa="group-name">
                {{group()?.name}}
            </div>

            <button [cdkMenuTriggerFor]="menu" data-qa="group-menu" [cdkMenuTriggerData]="{  }">
              <ellipsis-horizontal-outline-icon />
            </button>

            <ng-template #menu>
              <div class="flex flex-col bg-white rounded shadow-lg border border-gray-200" cdkMenu>
                <button
                  cdkMenuItem
                  [routerLink]="['settings']"
                  class="px-4 py-2 hover:bg-gray-100 text-sm text-left flex items-center"
                  data-qa="rename-group">
                  <app-icon iconName='Pencil' [color]="group()?.color ?? 'blue'" class="mr-2" [size]="16"></app-icon>
                  <span>Rename group</span>
                </button>
                <button
                  cdkMenuItem
                  class="px-4 py-2 hover:bg-gray-100 text-sm text-left flex items-center"
                  data-qa="delete-group"
                  (click)="showConfirmDeletionDialog()">
                    <app-icon iconName='Trash' color="#991b1b" class="mr-2" [size]="16"></app-icon>
                    <span>Delete group</span>
                  </button>
              </div>
            </ng-template>

          </div>

          <a [routerLink]="transaction.id" *ngFor="let transaction of transactions()"
              data-qa="transaction-item"
              class="rounded bg-slate-50 mb-1 flex whitespace-nowrap py-2 px-4 shadow items-center">
              <app-icon [iconName]="transaction.icon" [color]="group()?.color ?? 'blue'" class="mr-2"></app-icon>
              <div class="flex-1">
                  <div>{{transaction.title}}</div>
                  <div class="text-sm leading-tight text-gray-600">{{transaction.category}}&nbsp;</div>
              </div>
              <div class="font-semibold">{{transaction.value | currencyFormatted }}</div>
          </a>

          <div>
            <div *ngIf="!transactions().length" class="px-4 py-2 mb-4 rounded bg-gray-300">
                <i>No transactions</i>
            </div>
            <div [ngStyle]="{color: group()?.color}"
                class="mb-1 flex whitespace-nowrap py-2 px-4 place-content-between items-end flex-row-reverse">
                <a [routerLink]="['new']" [state]="{groupId:group()?.id}"
                    class="flex top-0 items-center text-sm cursor-pointer hover:underline">
                    <app-icon iconName='Plus' [color]="group()?.color ?? 'blue'" [size]="16"></app-icon>
                    <div class="flex-1">Add</div>
                </a>
            </div>
          </div>
        </div>

        <div class="w-full max-w-xs sm:mt-16">
          <app-graph title="Expenses" type="piechart" [data]="transactionsGraphData()"></app-graph>
        </div>
      </div>
    </div>
    <router-outlet></router-outlet>
    <app-dialog *ngIf="confirmDelete()">
      <ng-container>
        <div class="text-xl font-bold mb-4 mt-2">Delete group</div>
        <div class="mb-2">
          Are you sure you want to delete the group <span class="whitespace-nowrap font-bold">{{group()?.name}}</span>?
        </div>
        <div class="flex justify-end">
          <button class="rounded px-4 py-2 mt-4 mr-2 border border-slate-300 hover:bg-gray-100 text-gray-800 bg-white" (click)="hideConfirmDeletionDialog()">
            Cancel
          </button>
          <button class="rounded px-4 py-2 mt-4 border bg-orange-700 hover:bg-orange-800 text-white" (click)="deleteGroup()">
            Delete
          </button>
        </div>
      </ng-container>
    </app-dialog>
  `,
  styles: ``
})
export class GroupComponent {
  groupsService = inject(TransactionGroupsService);
  transactionsService = inject(TransactionsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  private state = signal<TransactionsGroupState>({
    error: null,
    status: 'loading'
  });

  error = computed(() => this.state().error);
  status = computed(() => this.state().status);
  urlParams = toSignal(this.route.params);
  groupId = computed<string | undefined>(() => this.urlParams()?.['groupId']);
  group = computed<Group | undefined>(() => this.groupId() ? this.groupsService.groups().find(g => g.id === this.groupId()) : undefined);
  transactions = computed(() => this.groupId() ? this.transactionsService.transactions().filter(t => t.groupId === this.groupId()) : []);

  confirmDelete = signal<boolean>(false);

  transactionsGraphData = computed(() => {
    const transactions = this.transactions();
    return this.group()
      ? transactions
        .sort((a, b) => (b.value||0) - (a.value||0))
        .filter(t => t.value !== 0)
        .map((transaction, index) => {
          return {
            label: transaction.title,
            value: transaction.value||0,
            color: this.generateHue(this.group()?.color, index)
          };
        })
      : [];
  });

  deleteGroup() {
    const group = this.group();
    this.hideConfirmDeletionDialog();
    if (!group)
      return;
    this.groupsService.remove$.next(group);
    this.router.navigate(['']);
  }

  showConfirmDeletionDialog() {
    this.confirmDelete.update(() => true);
  }
  hideConfirmDeletionDialog() {
    this.confirmDelete.update(() => false);
  }

  generateHue(baseColor: string|undefined, index: number) {
    const color = baseColor || "#000";
    const hue = color.replace(/^#/, '');
    const r = parseInt(hue.substring(0, 2), 16);
    const g = parseInt(hue.substring(2, 4), 16);
    const b = parseInt(hue.substring(4, 6), 16);
    const hsl = this.rgbToHsl(r, g, b);
    const h = hsl[0];
    const s = hsl[1];
    const l = hsl[2];
    const newHue = (h * 360 + index * 35) % 360;
    const newColor = `hsl(${newHue},${s * 100}%,${l * 100}%)`;
    return newColor;
  }

  
  rgbToHsl(r: number, g: number, b: number) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = (max + min) / 2, s = (max + min) / 2, l = (max + min) / 2;
  
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    return [h, s, l];
  }
}
