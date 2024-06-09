import { Component, computed, inject } from '@angular/core';
import { CurrencyFormattedPipe } from '../../shared/pipes/currency-formatted.pipe';
import { CurrencyPipe, NgIf, NgSwitchCase } from '@angular/common';
import { SolidIconsModule } from '@dimaslz/ng-heroicons';
import { TransactionsService } from 'src/app/shared/data-access/transactions.service';
import notEmpty from 'src/app/shared/utils/not-empty';

@Component({
  selector: 'app-current-balance',
  template: `@switch (service.status()) {
    @case ('loading') {
      <div class="shadow rounded-3xl animate-pulse w-full min-h-[200px] bg-gradient-to-br from-blue-500 via-violet-500 to-orange-500 flex flex-col items-center place-content-between text-white">
      </div>
    }
    @case ('success') {
      <div class="shadow rounded-3xl w-full min-h-[200px] bg-gradient-to-br from-blue-500 via-violet-500 to-orange-500 flex flex-col items-center place-content-between text-white">

        <div class="text-sm pt-10">Current balance</div>
        <div class="text-4xl pb-8 font-semibold">{{totalSum() | currencyFormatted}}</div>
        <div class="flex place-content-between pb-6 w-full">

          <div class="flex flex-1 items-center justify-center">
            <currency-dollar-solid-icon [size]="32"></currency-dollar-solid-icon>
            <div class="pl-2 whitespace-nowrap">
              <div class="text-xs">Income</div>
              <div>{{totalIncomes() | currency: 'SEK' :'symbol-narrow':'0.0-0'}}</div>
            </div>
          </div>

          <div class="flex flex-1 items-center justify-center">
            <credit-card-solid-icon [size]="32"></credit-card-solid-icon>
            <div class="pl-2 whitespace-nowrap">
              <div class="text-xs">Expenses</div>
              <div>{{totalExpenses() | currencyFormatted}}</div>
            </div>
          </div>
        </div>
      </div>
    }
  }

  `,
  standalone: true,
  imports: [SolidIconsModule, CurrencyPipe, CurrencyFormattedPipe, NgIf, NgSwitchCase]
})
export class CurrentBalanceComponent {
  service = inject(TransactionsService);

  values = computed<number[]>(() => this.service.transactions().map(t => t.value).filter(notEmpty));
  totalIncomes = computed<number>(() => this.values().filter(v => v > 0).reduce((a, b) => b + a, 0));
  totalExpenses = computed<number>(() => this.values().filter(v => v < 0).reduce((a, b) => b + a, 0));
  totalSum = computed<number>(() => this.totalIncomes() + this.totalExpenses());
}
