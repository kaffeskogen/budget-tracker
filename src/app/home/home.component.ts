import { Component, computed, effect, inject } from '@angular/core';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TransactionsGroupComponent } from './transactions-group/transactions-group.component';
import { NgIf, NgFor, JsonPipe } from '@angular/common';
import { CurrentBalanceComponent } from './current-balance/current-balance.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { GraphComponent } from '../shared/ui/graph/graph.component';
import { TransactionsService } from '../shared/data-access/transactions.service';
import { Group } from '../shared/interfaces/Group';
import { ToastService } from '../shared/ui/toast/toast.service';

@Component({
    selector: 'app-home',
    template: `
      <div class="p-8 mb-32">
        <div class="flex flex-col lg:flex-row">
          <div class="grid gap-y-8 w-full max-w-md mr-16">
            <app-header></app-header>
            <app-current-balance></app-current-balance>

            <button class="bg-white p-4 rounded-md border border-gray-200 hover:bg-slate-50 cursor-pointer" [routerLink]="['create-group']">+ Create group</button>

            <ng-container *ngIf="groupsService.status() === 'success'">
              <app-transactions-group *ngFor="let group of groupsService.groups()" [group]="group" [color]="group.color">
              </app-transactions-group>
            </ng-container>

            <app-transactions-group *ngIf="orphanedTransactions().length" [group]="orphanedGroup()" [transactions]="orphanedTransactions()" [color]="orphanedGroup().color">
              </app-transactions-group>

            <ng-container *ngIf="groupsService.status() === 'loading'">
              <app-transactions-group>
              </app-transactions-group>
            </ng-container>


          </div>

          @if(expensesGraphData().length) {
            <div class="w-full max-w-xs mt-16">
              <app-graph title="Expenses" type="piechart" [data]="expensesGraphData()"></app-graph>
            </div>
          }

        </div>

        <router-outlet></router-outlet>
      </div>
    `,
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [HeaderComponent, CurrentBalanceComponent, NgIf, NgFor, TransactionsGroupComponent, RouterOutlet, SidenavComponent, GraphComponent, JsonPipe, RouterLink]
})
export class HomeComponent {

  groupsService = inject(TransactionGroupsService);
  transactionsService = inject(TransactionsService);

  toastService = inject(ToastService);

  groups = computed(() => this.groupsService.groups());

  orphanedGroup = computed<Group>(() => ({
    id: 'orphaned',
    name: 'Transactions without group',
    color: 'gray-400'
  }));

  orphanedTransactions = computed(() => this.transactionsService.transactions()
    .filter(t => this.groups().find(g => g.id === t.groupId) === undefined)
    .map(t => ({...t, group: this.orphanedGroup() })));

  graphData = computed(() => {
    const transactions = this.transactionsService.transactions();
    return this.groups()
      .map(group => {
        const groupTransactions = transactions.filter(t => t.groupId === group.id);
        const values = groupTransactions.map(t => t.value||0);
        const totale = values.reduce((a,b) => a + b, 0);
        return {
          label: group.name,
          value: totale,
          color: group.color
        };
      })
      .filter(g => g.value !== 0)
      .sort((a, b) => a.value - b.value);
  });

  expensesGraphData = computed(() => this.graphData()
    .filter(g => g.value < 0)
    .map((g) => ({...g, value: Math.abs(g.value)})));

  incomesGraphData = computed(() => this.graphData()
    .filter(g => g.value > 0)
    .map((g) => ({...g, value: Math.abs(g.value)})));

}
