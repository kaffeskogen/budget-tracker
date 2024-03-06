import { Injectable, InjectionToken, PLATFORM_ID, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap, of, tap } from "rxjs";
import { MOCK_TRANSACTIONS } from '../mocks/transactions';
import { MOCK_GROUPS } from '../mocks/groups';
import { Transaction } from '../interfaces/Transaction';
import { Group } from '../interfaces/Group';
import { AuthService } from '../auth/auth.service';
import { CloudDriveService } from './cloud-drive.service';
import { toObservable } from '@angular/core/rxjs-interop';

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

  private browserStorage = inject(IN_MEMORY);
  private authService = inject(AuthService);
  private cloudDriveService = inject(CloudDriveService);

  mockTransactions = computed(() => MOCK_TRANSACTIONS);

  mockGroups = computed(() => MOCK_GROUPS);
  
  loadTransactions(): Observable<Transaction[]> {
    return toObservable(this.authService.loggedIn)
      .pipe(
        mergeMap(loggedIn => !loggedIn
          ? of(MOCK_TRANSACTIONS)
          : this.cloudDriveService.getFileContentsOrEmptyString('transactions.json')
            .pipe(
              map(contents => typeof contents === 'string' ? JSON.parse(contents) as Transaction[] : contents)
            )
        )
      );
  }

  loadGroups(): Observable<Group[]> {
    return toObservable(this.authService.loggedIn)
      .pipe(
        mergeMap(loggedIn => !loggedIn
          ? of(MOCK_GROUPS)
          : this.cloudDriveService.getFileContentsOrEmptyString('groups.json')
            .pipe(
              map(contents => typeof contents === 'string' ? JSON.parse(contents) as Group[] : contents)
            )
        )
      );
  }

  saveTransactions(transactions: Transaction[]): Observable<void>  {
    return this.cloudDriveService.saveFileContents('transactions.json', JSON.stringify(transactions));
  }

  saveGroups(groups: Group[]): Observable<void>  {
    this.browserStorage.setItem('groups', JSON.stringify(groups));
    return of(undefined);
  }

}
