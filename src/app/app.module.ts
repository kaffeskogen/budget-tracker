import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgHeroiconsModule } from "@dimaslz/ng-heroicons";
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgHeroiconsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
