import { Injectable, InjectionToken, Injector, PLATFORM_ID, Signal, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap, of, tap } from "rxjs";
import { MOCK_TRANSACTIONS } from '../mocks/transactions';
import { MOCK_GROUPS } from '../mocks/groups';
import { Transaction } from '../interfaces/Transaction';
import { Group } from '../interfaces/Group';
import { AuthService } from '../auth/auth.service';
import { CloudDriveService } from './cloud-drive.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

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
  private injector = inject(Injector);

  private browserStorage = inject(IN_MEMORY);
  private authService = inject(AuthService);
  private cloudDriveService = inject(CloudDriveService);

  mockTransactions = computed(() => MOCK_TRANSACTIONS);

  cloudTransactions = this.cloudDriveService.getFileContentsOrEmptyString('transactions.json')
    .pipe(map(contents => contents ? JSON.parse(contents) as Transaction[] : []));

  mockGroups = computed(() => MOCK_GROUPS);
  
  loadTransactions(): Observable<Transaction[]> {
    return toObservable(this.authService.loggedIn)
      .pipe(tap(loggedIn => { console.log('logged in', loggedIn); }))
      .pipe(mergeMap(loggedIn => loggedIn ? this.cloudTransactions : of(MOCK_TRANSACTIONS)));
  }

  loadGroups(): Observable<Group[]> {
    const groups = this.browserStorage.getItem('groups');
    return of(groups ? (JSON.parse(groups) as Group[]) : MOCK_GROUPS);
  }

  saveTransactions(transactions: Transaction[]): Observable<void>  {
    this.browserStorage.setItem('transactions', JSON.stringify(transactions));
    return of(undefined);
  }

  saveGroups(groups: Group[]): Observable<void>  {
    this.browserStorage.setItem('groups', JSON.stringify(groups));
    return of(undefined);
  }



}
