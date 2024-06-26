import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { TransactionComponent } from './transaction/transaction.component';
import { CreateGroupComponent } from './create-group/create-group.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'new',
        component: TransactionComponent
      },
      {
        path: 'create-group',
        component: CreateGroupComponent
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
