import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject, filter, find, map, retry, startWith, switchMap } from 'rxjs';
import { ApiService } from 'src/app/shared/data-access/api.service';
import { Transaction } from 'src/app/shared/interfaces/Transaction';

export interface TransactionsState {
  transactions: Transaction[];
  groupId: string | null;
  error: string | null;
  showAll: boolean;
  status: 'loading' | 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsGroupService {

  private apiService = inject(ApiService);
  private state = signal<TransactionsState>({
    error: null,
    groupId: null,
    status: 'loading',
    showAll: false,
    transactions: []
  });

  retry$ = new Subject<void>();
  error$ = new Subject<Error>();
  showAll$ = new Subject<boolean>();
  groupId$ = new Subject<string>();

  readonly THRESHOLD = 3;

  showAll = computed(() => this.state().showAll);
  transactions = computed(() => this.state().transactions);
  visiableTransactions = computed(() =>
    this.transactions()
      .slice(0, this.showAll()
        ? this.transactions().length
        : Math.min(this.transactions().length, this.THRESHOLD)));
  sum = computed(() => this.transactions().reduce((a, b) => a + (b.value ?? 0), 0));
  error = computed(() => this.state().error);
  groupId = computed(() => this.state().groupId);
  status = computed(() => this.state().status);

  transactionsInGroup$ = this.groupId$.pipe(
    startWith(null),
    switchMap((groupId) =>
      this.apiService.$transactions
        .pipe(
          map(items => items.filter(i => i.groupId === groupId)),
          retry({
            delay: (err) => {
              this.error$.next(err);
              return this.retry$;
            }
          })
        )
    )
  )

  constructor() {
    this.transactionsInGroup$
      .pipe(takeUntilDestroyed())
      .subscribe((transactions) => {
        console.log('Success!');
        this.state.update((state) => ({
          ...state,
          transactions,
          status: "success"
        } satisfies TransactionsState))
      });

    this.retry$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.state.update((state) => ({
          ...state,
          status: "loading"
        }))
      });

    this.showAll$
      .pipe(takeUntilDestroyed())
      .subscribe((showAll) => {
        this.state.update((state) => ({ ...state, showAll }))
      })

    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe((error) =>
        this.state.update((state) => ({
          ...state,
          status: "error",
          error: error.message,
        } satisfies TransactionsState))
      );

  }

}
