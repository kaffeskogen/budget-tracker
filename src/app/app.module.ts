import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgHeroiconsModule } from "@dimaslz/ng-heroicons";
import { CommonModule, registerLocaleData } from '@angular/common';

import localeSwedish from '@angular/common/locales/sv';
registerLocaleData(localeSwedish);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgHeroiconsModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'sv' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
