import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';
import { Subject, of } from "rxjs";
import { MOCK_TRANSACTIONS } from '../mocks/transactions';
import { MOCK_GROUPS } from '../mocks/groups';
import { Transaction } from '../interfaces/Transaction';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';

export interface TransactionsServiceState {
    transactions: Transaction[];
    status: 'error' | 'success' | 'loading';
    error: string | null;
}


@Injectable({
    providedIn: 'root'
})
export class TransactionsService {

    storageService = inject(StorageService);

    transactionsLoaded$ = this.storageService.loadTransactions();

    add$ = new Subject<Omit<Transaction, 'id'>>();
    remove$ = new Subject<Transaction>();
    edit$ = new Subject<Transaction>();

    // state
    private state = signal<TransactionsServiceState>({
        transactions: [],
        status: 'loading',
        error: null,
    });

    transactions = computed(() => this.state().transactions);
    status = computed(() => this.state().status);
    error = computed(() => this.state().error);

    transaction(id: string): Signal<Transaction | undefined> {
        return computed(() => this.transactions()?.find((t) => t.id === id));
    }

    constructor() {

        this.transactionsLoaded$
            .pipe(takeUntilDestroyed())
            .subscribe({
                next: (transactions) =>
                    this.state.update((state) => ({
                        ...state,
                        transactions,
                        status: 'success',
                    } satisfies TransactionsServiceState)),
                error: (err) => this.state.update((state) => ({ ...state, status: 'error', error: err }))
            });

        this.add$.pipe(takeUntilDestroyed()).subscribe((transaction) => {
            return this.state.update((state) => ({
                ...state,
                transactions: [
                    ...state.transactions,
                    {
                        ...transaction,
                        id: Date.now().toString()
                    }
                ]
            } satisfies TransactionsServiceState))
        });

        this.edit$.pipe(takeUntilDestroyed()).subscribe((update) => {
            return this.state.update((state) => ({
                ...state,
                transactions: state.transactions.map((item) =>
                    item.id === update.id ? { ...update } : item
                )
            }))
        });

        this.remove$.pipe(takeUntilDestroyed()).subscribe((transaction) =>
            this.state.update((state) => ({
                ...state,
                transactions: state.transactions.filter((item) => item.id !== transaction.id),
            }))
        );

        effect(() => {
            if (this.status() === 'success') {
                console.log('updating transactions', this.transactions());
                this.storageService.saveTransactions(this.transactions());
            }
        });
    }
}