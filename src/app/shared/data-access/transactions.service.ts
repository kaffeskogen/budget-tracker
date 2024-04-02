import { Injectable, Signal, computed, effect, inject, signal, untracked } from '@angular/core';
import { Subject, tap } from "rxjs";
import { Transaction } from '../interfaces/Transaction';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';

export interface TransactionsServiceState {
    transactions: Transaction[];
    status: 'error' | 'success' | 'loading';
    error: string | null;
    save: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class TransactionsService {

    storageService = inject(StorageService);

    transactionsLoaded$ = this.storageService.transactions$;

    add$ = new Subject<Omit<Transaction, 'id'>>();
    remove$ = new Subject<Transaction>();
    edit$ = new Subject<Transaction>();


    // state
    private state = signal<TransactionsServiceState>({
        transactions: [],
        status: 'loading',
        error: null,
        save: false
    });

    transactions = computed(() => this.state().transactions);
    status = computed(() => this.state().status);
    error = computed(() => this.state().error);
    save = computed(() => this.state().save);

    transaction(id: string): Signal<Transaction | undefined> {
        return computed(() => this.transactions()?.find((t) => t.id === id));
    }

    constructor() {

        this.transactionsLoaded$
            .pipe(
                takeUntilDestroyed()
            )
            .subscribe({
                next: (transactions) =>{
                    if (!transactions) return;
                    this.state.update((state) => ({
                        ...state,
                        transactions,
                        status: 'success'
                    } satisfies TransactionsServiceState))
                },
                error: (response) => {
                    this.state.update((state) => ({ ...state, status: 'error', error: response?.message || response?.error?.error?.message || 'Unknown error' }));
                }
            });

        this.add$.pipe(takeUntilDestroyed()).subscribe((transaction) => {
            return this.state.update((state) => ({
                ...state,
                save: true,
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
                save: true,
                transactions: state.transactions.map((item) =>
                    item.id === update.id ? { ...update } : item
                )
            } satisfies TransactionsServiceState))
        });

        this.remove$.pipe(takeUntilDestroyed()).subscribe((transaction) =>
            this.state.update((state) => ({
                ...state,
                save: true,
                transactions: state.transactions.filter((item) => item.id !== transaction.id),
            } satisfies TransactionsServiceState))
        );

        effect(() => {

            if (!this.save()) {
                return;
            }

            console.log('Saving transactions', this.transactions());
            this.storageService.saveTransactions(this.transactions());
            return;

        });
    }
}