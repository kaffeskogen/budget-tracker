import { Injectable } from '@angular/core';
import { of } from "rxjs";
import { MOCK_TRANSACTIONS } from '../mocks/transactions';
import { MOCK_GROUPS } from '../mocks/groups';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  $transactions = of(MOCK_TRANSACTIONS);
  $groups = of(MOCK_GROUPS);

}
