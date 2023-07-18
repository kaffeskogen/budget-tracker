import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { CurrentBalanceComponent } from './current-balance/current-balance.component';
import { TableComponentModule } from '../shared/ui/table/table.module';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    CurrentBalanceComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    TableComponentModule
  ]
})
export class HomeModule { }
