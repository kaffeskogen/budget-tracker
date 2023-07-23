import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { IconComponent } from './icons/icon/icon.component';


@NgModule({
  declarations: [
    IconComponent
  ],
  imports: [
    CommonModule,
    NgHeroiconsModule
  ],
  exports: [
    NgHeroiconsModule,
    IconComponent
  ]
})
export class SharedModule { }
