import { NgModule } from '@angular/core';
import {
  RouterConfigOptions,
  RouterModule,
  Routes
} from '@angular/router';
import { TransactionComponent } from './home/transaction/transaction.component';
import { GroupComponent } from './group/group.component';
import { GroupSettingsComponent } from './group/ui/group-settings/group-settings.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'g/:groupId',
    component: GroupComponent,
    children: [
      {
        path: 'new',
        component: TransactionComponent
      },
      {
        path: 'settings',
        component: GroupSettingsComponent
      },
      {
        path: ':transactionId',
        component: TransactionComponent
      }
    ]
  }
];

const routerConfig: RouterConfigOptions = {
  paramsInheritanceStrategy: 'always'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
