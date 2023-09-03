import { Injectable, computed, inject } from '@angular/core';
import { TransactionsService } from 'src/app/shared/data-access/transactions.service';
import notEmpty from 'src/app/shared/utils/not-empty';

@Injectable()
export class CurrentBalanceService {

  private service = inject(TransactionsService);

  values = computed<number[]>(() => this.service.transactions().map(t => t.value).filter(notEmpty));
  totalIncomes = computed<number>(() => this.values().filter(v => v > 0).reduce((a, b) => b + a));
  totalExpenses = computed<number>(() => this.values().filter(v => v < 0).reduce((a, b) => b + a));
  totalSum = computed<number>(() => this.totalIncomes() + this.totalExpenses())

}
