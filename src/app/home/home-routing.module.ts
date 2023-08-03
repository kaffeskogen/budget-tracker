import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'new', component: NewTransactionComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
