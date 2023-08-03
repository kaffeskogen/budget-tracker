import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { CurrentBalanceComponent } from './current-balance/current-balance.component';
import { TableComponentModule } from '../shared/ui/table/table.module';
import { TransactionsGroupComponent } from './transactions-group/transactions-group.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    CurrentBalanceComponent,
    TransactionsGroupComponent,
    NewTransactionComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    TableComponentModule
  ],
  providers: [
    // { provide: LOCALE_ID, useValue: 'sv' }
  ]
})
export class HomeModule { }
