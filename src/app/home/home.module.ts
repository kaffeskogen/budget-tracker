import { LOCALE_ID, NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HeaderComponent } from './header/header.component';

import { CurrentBalanceComponent } from './current-balance/current-balance.component';

import { TransactionsGroupComponent } from './transactions-group/transactions-group.component';
import { TransactionComponent } from './transaction/transaction.component';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { GroupChoiceComponent } from './transaction/controls/group-choice.component';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../shared/icons/icon/icon.component';
import { DialogComponent } from '../shared/ui/dialog/dialog.component';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        FormsModule,
        IconComponent,
        DialogComponent,
        HomeComponent,
        HeaderComponent,
        CurrentBalanceComponent,
        TransactionsGroupComponent,
        TransactionComponent,
        EditTransactionComponent,
        GroupChoiceComponent
    ],
    providers: [
        // { provide: LOCALE_ID, useValue: 'sv' }
    ]
})
export class HomeModule { }
