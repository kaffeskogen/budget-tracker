import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject, filter, find, map, retry, startWith, switchMap } from 'rxjs';
import { ApiService } from 'src/app/shared/data-access/api.service';
import { Transaction } from 'src/app/shared/interfaces/Transaction';

export interface TransactionsState {
  transactions: Transaction[];
  groupId: string | null;
  error: string | null;
  status: 'loading' | 'success' | 'error';
}

@Injectable()
export class TableCardService {

  private apiService = inject(ApiService);
  private state = signal<TransactionsState>({
    error: null,
    groupId: null,
    status: 'loading',
    transactions: []
  });

  retry$ = new Subject<void>();
  error$ = new Subject<Error>();
  groupId$ = new Subject<string>();

  transactions = computed(() => this.state().transactions);
  sum = computed(() => this.transactions().reduce((a, b) => a + (b.value ?? 0), 0));
  error = computed(() => this.state().error);
  groupId = computed(() => this.state().groupId);
  status = computed(() => this.state().status);

  transactionsInGroup$ = this.groupId$.pipe(
    startWith(null),
    switchMap((groupId) =>
      this.apiService.getTransactionsByGroup(groupId).pipe(
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
    this.transactionsInGroup$.pipe(takeUntilDestroyed()).subscribe((transactions) =>
      this.state.update((state) => ({
        ...state,
        transactions,
        status: "success",
      } satisfies TransactionsState))
    );

    this.groupId$
      .pipe(takeUntilDestroyed())
      .subscribe((groupId) => {
        this.state.update((state) => ({
          ...state,
          groupId,
          status: "loading",
          transactions: [],
        } satisfies TransactionsState))
      });

    this.retry$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: "loading" }))
      );

    this.error$.pipe(takeUntilDestroyed()).subscribe((error) =>
      this.state.update((state) => ({
        ...state,
        status: "error",
        error: error.message,
      } satisfies TransactionsState))
    );

  }

}
