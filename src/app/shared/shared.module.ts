import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { CurrencyFormattedPipe } from './pipes/currency-formatted.pipe';
import { DialogComponent } from './ui/dialog/dialog.component';
import { PortalModule } from '@angular/cdk/portal';
import { IconComponent } from './icons/icon/icon.component';
import { FormModule } from './ui/form/form.module';


@NgModule({
  declarations: [
    CurrencyFormattedPipe,
    DialogComponent,
    IconComponent
  ],
  imports: [
    CommonModule,
    NgHeroiconsModule,
    PortalModule,
    FormModule
  ],
  exports: [
    NgHeroiconsModule,
    CurrencyFormattedPipe,
    DialogComponent,
    IconComponent,
    FormModule
  ]
})
export class SharedModule { }
