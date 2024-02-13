import { Component, computed, inject } from '@angular/core';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { RouterOutlet } from '@angular/router';
import { TransactionsGroupComponent } from './transactions-group/transactions-group.component';
import { NgIf, NgFor } from '@angular/common';
import { CurrentBalanceComponent } from './current-balance/current-balance.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { GraphComponent } from '../shared/ui/graph/graph.component';
import { TransactionsService } from '../shared/data-access/transactions.service';

@Component({
    selector: 'app-home',
    template: `
      <div class="p-8 mb-32">
        <div class="flex flex-col lg:flex-row">
          <div class="grid gap-y-8 w-full max-w-md mr-16">
            <app-header></app-header>
            <app-current-balance></app-current-balance>

            <ng-container *ngIf="groupsService.status() === 'error'">
              {{groupsService.error()}}
            </ng-container>

            <ng-container *ngIf="groupsService.status() === 'success'">
              <app-transactions-group *ngFor="let group of groupsService.groups()" [group]="group" [color]="group.color">
              </app-transactions-group>
            </ng-container>

            <ng-container *ngIf="groupsService.status() === 'loading'">
              <app-transactions-group>
              </app-transactions-group>
            </ng-container>
          </div>


          <div class="w-full max-w-md mt-16">
            <app-graph title="Expenses" type="piechart" [data]="expensesGraphData()"></app-graph>
            <app-graph title="Incomes" type="piechart" [data]="incomesGraphData()"></app-graph>
          </div>

        </div>

        <router-outlet></router-outlet>
      </div>
    `,
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [HeaderComponent, CurrentBalanceComponent, NgIf, NgFor, TransactionsGroupComponent, RouterOutlet, SidenavComponent, GraphComponent]
})
export class HomeComponent {

  groupsService = inject(TransactionGroupsService);
  transactionsService = inject(TransactionsService);

  groups = computed(() => this.groupsService.groups());

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
