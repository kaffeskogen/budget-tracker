import { Component, inject } from '@angular/core';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { TransactionsGroupComponent } from './transactions-group/transactions-group.component';
import { NgIf, NgFor } from '@angular/common';
import { CurrentBalanceComponent } from './current-balance/current-balance.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [HeaderComponent, CurrentBalanceComponent, NgIf, NgFor, TransactionsGroupComponent, RouterOutlet, SidenavComponent]
})
export class HomeComponent {

  service = inject(TransactionGroupsService);

}
