import { NgIf, NgStyle, NgFor } from '@angular/common';
import { Component, Input, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { IconComponent } from '../shared/icons/icon/icon.component';
import { CurrencyFormattedPipe } from '../shared/pipes/currency-formatted.pipe';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { TransactionsService } from '../shared/data-access/transactions.service';
import { Group } from '../shared/interfaces/Group';
import { toSignal } from '@angular/core/rxjs-interop';

export interface TransactionsGroupState {
  error: string | null;
  status: 'loading' | 'success' | 'error';
}

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [NgIf, NgStyle, NgFor, RouterLink, IconComponent, CurrencyFormattedPipe, RouterModule],
  template: `
    <div class="px-8 pt-8 pb-32">
      <div class="p-4 flex">
          <div class="text-xl font-bold" [ngStyle]="{color: group()?.color ?? 'blue'}">
              {{group()?.name}}
          </div>
      </div>

      <a [routerLink]="transaction.id" *ngFor="let transaction of transactions()"
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
    <router-outlet></router-outlet>
  `,
  styles: ``
})
export class GroupComponent {
  groupsService = inject(TransactionGroupsService);
  transactionsService = inject(TransactionsService);
  route = inject(ActivatedRoute);

  private state = signal<TransactionsGroupState>({
    error: null,
    status: 'loading'
  });

  error = computed(() => this.state().error);
  status = computed(() => this.state().status);
  urlParams = toSignal(this.route.params);
  groupId = computed<string | undefined>(() => this.urlParams()?.['id']);
  group = computed<Group | undefined>(() => this.groupId() ? this.groupsService.groups().find(g => g.id === this.groupId()) : undefined);
  transactions = computed(() => this.groupId() ? this.transactionsService.transactions().filter(t => t.groupId === this.groupId()): []);

}
