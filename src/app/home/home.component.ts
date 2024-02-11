import { Component, inject } from '@angular/core';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { TransactionsGroupComponent } from './transactions-group/transactions-group.component';
import { NgIf, NgFor } from '@angular/common';
import { CurrentBalanceComponent } from './current-balance/current-balance.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { GraphComponent } from '../shared/ui/graph/graph.component';

@Component({
    selector: 'app-home',
    template: `
      <div class="wrapper">
          <app-header></app-header>
          <div></div>
      </div>
      
      <div class="wrapper">
          <app-current-balance></app-current-balance>
          <app-graph type="piechart" [data]="graphs"></app-graph>
      </div>
      
      <div class="wrapper">
          
          <ng-container *ngIf="service.status() === 'error'">
              {{service.error()}}
          </ng-container>
          
          <ng-container *ngIf="service.status() === 'success'">
              <app-transactions-group *ngFor="let group of service.groups()" [group]="group" [color]="group.color">
              </app-transactions-group>
          </ng-container>
          
          <ng-container *ngIf="service.status() === 'loading'">
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

  service = inject(TransactionGroupsService);

  graphs = [{
    label: 'Food',
    value: 30
  }, {
    label: 'Transportation',
    value: 20
  }, {
    label: 'Entertainment',
    value: 15
  }, {
    label: 'Shopping',
    value: 350
  }]

}
