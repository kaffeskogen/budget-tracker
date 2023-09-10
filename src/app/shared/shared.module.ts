import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { CurrencyFormattedPipe } from './pipes/currency-formatted.pipe';
import { PortalModule } from '@angular/cdk/portal';
import { IconComponent } from './icons/icon/icon.component';
import { DynamicFormModule } from './ui/dynamic-form/dynamic-form.module';
import { CalloutComponent } from './ui/callout/callout.component';
import { DialogComponent } from './ui/dialog/dialog.component';


@NgModule({
  declarations: [
    CurrencyFormattedPipe,
    DialogComponent,
    IconComponent,
    CalloutComponent
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
    DialogComponent,
    IconComponent,
    DynamicFormModule
  ]
})
export class SharedModule { }
