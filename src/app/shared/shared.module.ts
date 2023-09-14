import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { CurrencyFormattedPipe } from './pipes/currency-formatted.pipe';
import { PortalModule } from '@angular/cdk/portal';
import { DynamicFormModule } from './ui/dynamic-form/dynamic-form.module';
import { DialogComponent } from './ui/dialog/dialog.component';


@NgModule({
  declarations: [
    CurrencyFormattedPipe,
  ],
  imports: [
    CommonModule,
    NgHeroiconsModule,
    PortalModule,
    DynamicFormModule
  ],
  exports: [
    NgHeroiconsModule,
    CurrencyFormattedPipe,
    DynamicFormModule
  ]
})
export class SharedModule { }
