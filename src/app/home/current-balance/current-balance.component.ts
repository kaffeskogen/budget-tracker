import { Component, inject } from '@angular/core';
import { CurrentBalanceService } from './current-balance.service';
import { CurrencyFormattedPipe } from '../../shared/pipes/currency-formatted.pipe';
import { CurrencyPipe } from '@angular/common';
import { SolidIconsModule } from '@dimaslz/ng-heroicons';

@Component({
    selector: 'app-current-balance',
    template: `
    <div class="shadow rounded-3xl w-full min-h-[200px] bg-gradient-to-br from-blue-500 via-violet-500 to-orange-500 flex flex-col items-center place-content-between text-white">
      <div class="text-sm pt-10">Current balance</div>
      <div class="text-4xl pb-8 font-semibold">{{service.totalSum() | currencyFormatted}}</div>
      <div class="flex place-content-between pb-6 w-full">
 
        <div class="flex flex-1 items-center justify-center">
          <currency-dollar-solid-icon [size]="32"></currency-dollar-solid-icon>
          <div class="pl-2 whitespace-nowrap">
            <div class="text-xs">Income</div>
            <div>{{service.totalIncomes() | currency: 'SEK' :'symbol-narrow':'0.0-0'}}</div>
          </div>
        </div>

        <div class="flex flex-1 items-center justify-center">
          <credit-card-solid-icon [size]="32"></credit-card-solid-icon>
          <div class="pl-2 whitespace-nowrap">
            <div class="text-xs">Expenses</div>
            <div>{{service.totalExpenses() | currencyFormatted}}</div>
          </div>
        </div>
      </div>
    </div>
  `,
    providers: [
        CurrentBalanceService
    ],
    standalone: true,
    imports: [SolidIconsModule, CurrencyPipe, CurrencyFormattedPipe]
})
export class CurrentBalanceComponent {
  service = inject(CurrentBalanceService)
}
