import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      {
        path: 'new',
        component: TransactionComponent
      },
      {
        path: 'edit',
        redirectTo: ''
      },
      {
        path: 'edit/:transactionId',
        component: TransactionComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
