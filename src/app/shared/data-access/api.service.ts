import { Injectable } from '@angular/core';
import { Observable, delay, of, switchMap, throwError } from "rxjs";
import { MOCK_TRANSACTIONS } from '../mocks/transactions';
import { MOCK_GROUPS } from '../mocks/groups';
import { Transaction } from '../interfaces/Transaction';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  $transactions = of(MOCK_TRANSACTIONS);
  $groups = of(MOCK_GROUPS);

}
