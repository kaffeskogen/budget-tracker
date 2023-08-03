import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { IconComponent } from './icons/icon/icon.component';
import { CurrencyFormattedPipe } from './pipes/currency-formatted.pipe';
import { DialogComponent } from './ui/dialog/dialog.component';
import { PortalModule } from '@angular/cdk/portal';


@NgModule({
  declarations: [
    IconComponent,
    CurrencyFormattedPipe,
    DialogComponent
  ],
  imports: [
    CommonModule,
    NgHeroiconsModule,
    PortalModule
  ],
  exports: [
    NgHeroiconsModule,
    IconComponent,
    CurrencyFormattedPipe,
    DialogComponent
  ]
})
export class SharedModule { }
