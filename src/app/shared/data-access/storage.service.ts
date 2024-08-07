import { Injectable, InjectionToken, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, firstValueFrom, lastValueFrom, map, mergeMap, of, shareReplay, tap } from "rxjs";
import { MOCK_TRANSACTIONS } from '../mocks/transactions';
import { MOCK_GROUPS } from '../mocks/groups';
import { Transaction } from '../interfaces/Transaction';
import { Group } from '../interfaces/Group';
import { AppStorageProvider } from '../interfaces/AppStorageProvider';
import { AppStorage } from '../interfaces/AppStorage';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { EmptyStorageProvider } from './empty-storage-provider';

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

  public storageProvider = signal<AppStorageProvider>(new EmptyStorageProvider());

  private _transactions$ = new BehaviorSubject<Transaction[]|null>(null);
  transactions$ = this._transactions$
    .pipe(mergeMap(transactions => transactions ? of(transactions) : EMPTY), shareReplay(1))
  private _groups$ = new BehaviorSubject<Group[]|null>(null);
  groups$ = this._groups$
    .pipe(mergeMap(groups => groups ? of(groups) : EMPTY), shareReplay(1))

  constructor() {
    toObservable(this.storageProvider)
      .pipe(
        takeUntilDestroyed(),
        mergeMap((provider: AppStorageProvider | null) => provider ? provider.periodAppStorage$ : of(null))
      ).subscribe({
        next: (appStorage: AppStorage | null) => {
          if (!appStorage) {
            return;
          }
          this._transactions$.next(appStorage.transactions);
          this._groups$.next(appStorage.groups);
        },
        error: (error: any) => {
          this._groups$.error('Could not fetch app storage');
          this._transactions$.error('Could not fetch app storage');
        }
      });
  }

  async saveTransactions(transactions: Transaction[]): Promise<void> {
    const provider = this.storageProvider();
    if (!provider) {
      console.error('No storage provider set, cannot save transactions');
      return;
    }

    const groups = this._groups$.value;
    if (!groups) {
      console.error('Groups cannot be null');
      return;
    }

    this._transactions$.next(transactions);
    await this.storageProvider()?.saveAppStorage({ groups, transactions });
  }

  async saveGroups(groups: Group[]): Promise<void> {
    const provider = this.storageProvider();
    if (!provider) {
      console.error('No storage provider set, cannot save transactions');
      return;
    }

    const transactions = this._transactions$.value;
    if (!transactions) {
      console.error('Groups cannot be null');
      return;
    }
    
    this._groups$.next(groups);
    await this.storageProvider()?.saveAppStorage({ transactions, groups });
  }

}
