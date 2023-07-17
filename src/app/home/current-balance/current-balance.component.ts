import { Component } from '@angular/core';

@Component({
  selector: 'app-current-balance',
  template: `
    <div class="rounded-3xl w-full min-h-[200px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center place-content-between text-white">
      <div class="text-sm pt-10">Current balance</div>
      <div class="text-4xl pb-8 font-semibold">4 538,00 kr</div>
      <div class="flex place-content-between pb-6 w-full">
 
        <div class="px-8 flex items-center">
          <currency-dollar-solid-icon [size]="32"></currency-dollar-solid-icon>
          <div class="pl-2">
            <div class="text-xs">Income</div>
            <div>43 400 kr</div>
          </div>
        </div>

        <div class="px-8 flex items-center">
          <credit-card-solid-icon [size]="32"></credit-card-solid-icon>
          <div class="pl-2">
            <div class="text-xs">Expenses</div>
            <div>37 862 kr</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CurrentBalanceComponent {

}
