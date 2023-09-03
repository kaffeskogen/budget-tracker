import { Component, Input, OnChanges, computed, inject, signal } from '@angular/core';
import { Group } from 'src/app/shared/interfaces/Group';
import { style, transition, trigger, animate } from '@angular/animations';
import { TransactionGroupsService } from 'src/app/shared/data-access/transaction-groups.service';
import { TransactionsService } from 'src/app/shared/data-access/transactions.service';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface TransactionsGroupState {
  groupId: string | null;
  error: string | null;
  showAll: boolean;
  status: 'loading' | 'success' | 'error';
}

@Component({
  selector: 'app-transactions-group',
  templateUrl: './transactions-group.component.html',
  styleUrls: ['./transactions-group.component.scss'],
  animations: [
    trigger(
      'outAnimation',
      [
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('0.25s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    ),
    trigger(
      'inAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('0.25s ease-out',
              style({ opacity: 1 }))
          ]
        )
      ]
    )
  ]
})
export class TransactionsGroupComponent implements OnChanges {
  groupsService = inject(TransactionGroupsService);
  transactionsService = inject(TransactionsService);

  @Input() color: string = '#333';
  @Input() group!: Group;

  private state = signal<TransactionsGroupState>({
    error: null,
    groupId: null,
    status: 'loading',
    showAll: false
  });

  showAll$ = new Subject<boolean>();

  readonly THRESHOLD = 3;

  showAll = computed(() => this.state().showAll);
  transactions = computed(() =>
    this.transactionsService.transactions()
      .filter(t => t.groupId === this.state().groupId));
  visibleTransactions = computed(() =>
    this.transactions()
      .slice(0, this.showAll()
        ? this.transactions().length
        : Math.min(this.transactions().length, this.THRESHOLD)));
  sum = computed(() => this.transactions().reduce((a, b) => a + (b.value ?? 0), 0));
  error = computed(() => this.state().error);
  status = computed(() => this.state().status);

  ngOnChanges(): void {
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
