import { Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { Observable, Subject, of } from "rxjs";
import { MOCK_TRANSACTIONS } from '../mocks/transactions';
import { MOCK_GROUPS } from '../mocks/groups';
import { Transaction } from '../interfaces/Transaction';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Group } from '../interfaces/Group';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  }
);

export const IN_MEMORY = new InjectionToken<Storage>(
  'in memory storage object',
  {
    providedIn: 'root',
    factory: () => {
      const storage: {[key: string]: string} = {};
      return { getItem: (name: string) => storage[name], setItem: (name: string, value: string) => { storage[name] = value; } } as Storage;
    }
  }
);


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storage = inject(IN_MEMORY);

  loadTransactions(): Observable<Transaction[]> {
    const transactions = this.storage.getItem('transactions');
    return of(transactions ? (JSON.parse(transactions) as Transaction[]) : MOCK_TRANSACTIONS);
  }

  loadGroups(): Observable<Group[]> {
    const groups = this.storage.getItem('groups');
    return of(groups ? (JSON.parse(groups) as Group[]) : MOCK_GROUPS);
  }

  saveTransactions(transactions: Transaction[]) {
    this.storage.setItem('transactions', JSON.stringify(transactions));
  }

  saveGroups(groups: Group[]) {
    this.storage.setItem('groups', JSON.stringify(groups));
  }


}
