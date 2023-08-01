import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/shared/data-access/api.service';
import { Transaction } from 'src/app/shared/interfaces/Transaction';
import notEmpty from 'src/app/shared/utils/not-empty';

export interface CurrentBalanceState {
  transactions: Transaction[];
}

@Injectable()
export class CurrentBalanceService {

  private api = inject(ApiService);

  state = signal<CurrentBalanceState>({
    transactions: []
  });

  values = computed<number[]>(() => this.state().transactions.map(t => t.value).filter(notEmpty));
  totalIncomes = computed<number>(() => this.values().filter(v => v > 0).reduce((a, b) => b + a));
  totalExpenses = computed<number>(() => this.values().filter(v => v < 0).reduce((a, b) => b + a));
  totalSum = computed<number>(() => this.totalIncomes() + this.totalExpenses())

  constructor() {
    this.api.$transactions
      .pipe(takeUntilDestroyed())
      .subscribe(transactions => {
        this.state.update(state => ({
          ...state,
          transactions: transactions.filter(t => t.value !== undefined)
        }))
      })
  }

}
