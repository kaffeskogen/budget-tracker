import { Component, computed, inject } from '@angular/core';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
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
      <div class="wrapper">
          <app-header></app-header>
          <div></div>
      </div>
      
      <div class="wrapper">
          <app-current-balance></app-current-balance>
          <app-graph type="piechart" [data]="graphs()"></app-graph>
      </div>
      
      <div class="wrapper">
          
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
  graphs = computed(() => {
    const transactions = this.transactionsService.transactions();
    return this.groups().map(group => {
      const groupTransactions = transactions.filter(t => t.groupId === group.id);
      const values = groupTransactions.map(t => (t.value||0)*-1).filter(v => v>0);
      const totale = values.reduce((a,b) => a + b, 0)
      console.log(groupTransactions, values, totale);
      return {
        label: group.name,
        value: totale,
        color: group.color
      };
    })
});

}
