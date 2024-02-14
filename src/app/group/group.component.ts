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
import * as colors from 'tailwindcss/colors';
import { GraphComponent } from '../shared/ui/graph/graph.component';

export interface TransactionsGroupState {
  error: string | null;
  status: 'loading' | 'success' | 'error';
}

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [NgIf, NgStyle, NgFor, RouterLink, IconComponent, CurrencyFormattedPipe, RouterModule, CdkMenuTrigger, CdkMenu, CdkMenuItem, OutlineIconsModule, GroupSettingsComponent, GraphComponent],
  template: `
    <div class="p-8 mb-32">
      <div class="flex flex-col lg:flex-row">
        <div class="w-full max-w-md mr-16">
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
                  (click)="deleteGroup()">
                    <app-icon iconName='Trash' [color]="colors.red['800']" class="mr-2" [size]="16"></app-icon>
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

        <div class="w-full max-w-xs mt-16">
          <app-graph title="Expenses" type="piechart" [data]="transactionsGraphData()"></app-graph>
        </div>
      </div>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: ``
})
export class GroupComponent {
  groupsService = inject(TransactionGroupsService);
  transactionsService = inject(TransactionsService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  colors = colors;
  
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

  transactionsGraphData = computed(() => {
    const transactions = this.transactions();
    return this.group()
      ? transactions.map(transaction => {
          return {
            label: transaction.title,
            value: transaction.value||0,
            color: this.group()?.color||'#000'
          };
        })
      : [];
  });
  
  deleteGroup() {
    const group = this.group();
    if (!group)
      return;
    this.groupsService.remove$.next(group);
    this.router.navigate(['']);
  }
}
