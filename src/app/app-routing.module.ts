import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { TransactionComponent } from './home/transaction/transaction.component';
import { GroupComponent } from './group/group.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'g/:id',
    component: GroupComponent,
    children: [
      {
        path: 'new',
        component: TransactionComponent
      },
      {
        path: ':transactionId',
        component: TransactionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
