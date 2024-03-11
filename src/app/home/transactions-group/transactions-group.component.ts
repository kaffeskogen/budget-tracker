import { Component, Input, OnChanges, computed, inject, signal } from '@angular/core';
import { Group } from 'src/app/shared/interfaces/Group';
import { TransactionGroupsService } from 'src/app/shared/data-access/transaction-groups.service';
import { TransactionsService } from 'src/app/shared/data-access/transactions.service';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyFormattedPipe } from '../../shared/pipes/currency-formatted.pipe';
import { IconComponent } from '../../shared/icons/icon/icon.component';
import { RouterLink } from '@angular/router';
import { NgIf, NgStyle, NgFor } from '@angular/common';
import { Transaction } from 'src/app/shared/interfaces/Transaction';

export interface TransactionsGroupState {
  groupId: string | null;
  inputTransactions: Transaction[] | undefined;
  error: string | null;
  showAll: boolean;
  status: 'loading' | 'success' | 'error';
}

@Component({
    selector: 'app-transactions-group',
    templateUrl: './transactions-group.component.html',
    styleUrls: ['./transactions-group.component.scss'],
    standalone: true,
    imports: [NgIf, NgStyle, NgFor, RouterLink, IconComponent, CurrencyFormattedPipe]
})
export class TransactionsGroupComponent implements OnChanges {
  groupsService = inject(TransactionGroupsService);
  transactionsService = inject(TransactionsService);

  @Input() color: string = '#333';
  @Input() group!: Group;
  @Input('transactions') inputTransactions?: Transaction[];

  private state = signal<TransactionsGroupState>({
    error: null,
    groupId: null,
    status: 'loading',
    showAll: false,
    inputTransactions: undefined,
  });

  showAll$ = new Subject<boolean>();

  readonly THRESHOLD = 3;

  showAll = computed(() => this.state().showAll);

  transactions = computed<Transaction[]>(() => {
    const inputTransactions = this.state().inputTransactions;
    return inputTransactions ? inputTransactions
      : this.transactionsService.transactions()
        .filter(t => t.groupId === this.state().groupId);
  });

  visibleTransactions = computed(() =>
    this.transactions()
      .slice(0, this.showAll()
        ? this.transactions().length
        : Math.min(this.transactions().length, this.THRESHOLD)));
  sum = computed(() => this.transactions().reduce((a, b) => a + (b.value ?? 0), 0));
  error = computed(() => this.state().error);
  status = computed(() => this.state().status);

  ngOnChanges(): void {
    if (this.inputTransactions) {
      this.state.update((state) => ({ ...state, inputTransactions: this.inputTransactions }));
    }

    if (this.group) {
      this.state.update((state) => ({
        ...state,
        groupId: this.group.id,
        status: 'success'
      } satisfies TransactionsGroupState))
    }
  }

  constructor() {

    this.showAll$
      .pipe(takeUntilDestroyed())
      .subscribe((showAll) => {
        this.state.update((state) => ({ ...state, showAll }))
      })
  }
}
