import { Injectable } from '@angular/core';
import { Observable, delay, of, switchMap, throwError } from "rxjs";
import { MOCK_TRANSACTIONS } from '../mocks/transactions';
import { MOCK_GROUPS } from '../mocks/groups';
import { Transaction } from '../interfaces/Transaction';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  transactions$ = of(MOCK_TRANSACTIONS);
  groups$ = of(MOCK_GROUPS);

  getTransactionsByGroup(groupId: string | null): Observable<Transaction[]> {
    if (groupId === null) {
      return of([]);
    }

    const transactions = MOCK_TRANSACTIONS.filter(t => t.groupId === groupId);

    return of(transactions).pipe(
      delay(1000),
      switchMap(() =>
        Math.random() < 0 ? throwError(() => new Error("Oops")) : of(transactions)
      )
    );
  }

}
