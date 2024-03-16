import { Injectable, InjectionToken, PLATFORM_ID, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap, of, tap } from "rxjs";
import { MOCK_TRANSACTIONS } from '../mocks/transactions';
import { MOCK_GROUPS } from '../mocks/groups';
import { Transaction } from '../interfaces/Transaction';
import { Group } from '../interfaces/Group';
import { AppStorageProvider } from '../interfaces/AppStorageProvider';

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
      const storage: {[key: string]: string} = {};
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

  public storageProvider?: AppStorageProvider;
  
  loadTransactions(): Observable<Transaction[]> {
    if (!this.storageProvider) {
      throw new Error('No storage provider set');
    }
    return this.storageProvider.getAppStorage()
      .pipe(
        map(appStorage => appStorage.transactions)
      );
  }

  loadGroups(): Observable<Group[]> {
    if (!this.storageProvider) {
      throw new Error('No storage provider set');
    }
    return this.storageProvider.getAppStorage()
      .pipe(
        map(appStorage => appStorage.groups)
      );
  }

  saveTransactions(transactions: Transaction[]): Observable<void>  {
    // return this.storageProvider.saveFileContents('transactions.json', JSON.stringify(transactions));
    throw new Error('Not implemented');
  }

  saveGroups(groups: Group[]): Observable<void>  {
    // return this.cloudDriveService.saveFileContents('groups.json', JSON.stringify(groups));
    throw new Error('Not implemented');
  }

}
