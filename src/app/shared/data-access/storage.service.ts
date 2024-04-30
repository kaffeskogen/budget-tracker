import { Injectable, InjectionToken, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, mergeMap, of, tap } from "rxjs";
import { MOCK_TRANSACTIONS } from '../mocks/transactions';
import { MOCK_GROUPS } from '../mocks/groups';
import { Transaction } from '../interfaces/Transaction';
import { Group } from '../interfaces/Group';
import { AppStorageProvider } from '../interfaces/AppStorageProvider';
import { AppStorage } from '../interfaces/AppStorage';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

const test = new BehaviorSubject<string>("hello");

test.next('test')


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
      const storage: { [key: string]: string } = {};
      return { getItem: (name: string) => storage[name], setItem: (name: string, value: string) => { storage[name] = value; } } as Storage;
    }
  }
);

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  mockTransactions = computed(() => MOCK_TRANSACTIONS);

  mockGroups = computed(() => MOCK_GROUPS);

  public storageProvider = signal<AppStorageProvider | null>(null);

  transactions$ = new BehaviorSubject<Transaction[]|null>(null);
  groups$ = new BehaviorSubject<Group[]|null>(null);

  constructor() {
    toObservable(this.storageProvider)
      .pipe(
        takeUntilDestroyed(),
        mergeMap((provider: AppStorageProvider|null) => provider ? provider.getAppStorage() : of(null))
      ).subscribe({
        next: (appStorage: AppStorage|null) => {
          console.log('Subscribed', appStorage);
          if (appStorage) {
            this.transactions$.next(appStorage.transactions);
            this.groups$.next(appStorage.groups);
          }
        }
      });
  }

  async saveTransactions(transactions: Transaction[]): Promise<void> {
    if (!this.groups$.value) {
      console.error('Groups not loaded, cannot save transactions');
      return;
    }
    this.storageProvider()?.saveAppStorage({ transactions: transactions, groups: this.groups$.value });
  }

  saveGroups(groups: Group[]): void {
    if (!this.transactions$.value) {
      console.error('Transactions not loaded, cannot save groups');
      return;
    }
    this.storageProvider()?.saveAppStorage({ transactions: this.transactions$.value, groups: groups });
  }

}
