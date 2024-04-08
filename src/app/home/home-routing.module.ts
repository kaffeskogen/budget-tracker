import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SettingsComponent } from './settings/settings.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { GeneralSettingsComponent } from './settings/ui/general-settings/general-settings.component';
import { SetStorageFileComponent } from './settings/ui/set-storage-file/set-storage-file.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
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
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: '',
            component: GeneralSettingsComponent
          },
          {
            path: 'set-storage-file',
            component: SetStorageFileComponent
          }
        ]
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
