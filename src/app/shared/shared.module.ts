import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { IconComponent } from './icons/icon/icon.component';
import { CurrencyFormattedPipe } from './pipes/currency-formatted.pipe';


@NgModule({
  declarations: [
    IconComponent,
    CurrencyFormattedPipe
  ],
  imports: [
    CommonModule,
    NgHeroiconsModule
  ],
  exports: [
    NgHeroiconsModule,
    IconComponent,
    CurrencyFormattedPipe
  ]
})
export class SharedModule { }
