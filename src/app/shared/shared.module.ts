import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';

@NgModule({
  imports: [
    CommonModule,
    NgHeroiconsModule
  ],
  exports: [
    NgHeroiconsModule
  ]
})
export class SharedModule { }
