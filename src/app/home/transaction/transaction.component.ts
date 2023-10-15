import { Component, Signal, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import formJson from './transaction.form.json'
import { GroupChoiceComponent } from './controls/group-choice.component';
import { AppStateService } from 'src/app/shared/data-access/app-state.service';
import { Transaction } from 'src/app/shared/interfaces/Transaction';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionsService } from 'src/app/shared/data-access/transactions.service';
import { JsonForm } from 'src/app/shared/ui/dynamic-form/models/models';

@Component({
  selector: 'new-transaction',
  template: `
  <app-dialog (closeDialog)="closeDialog()">
    <ng-container>

      <app-dynamic-form
        *ngIf="formJson"
        [title]="isNewTransaction() ? 'New transaction' : 'Editing transaction'"
        [form]="formJson"
        [controlOverrides]="controlOverrides"
        [defaultValues]="transaction()"
        (onCancel)="closeDialog()"
        (onSave)="onSave($event)">
      </app-dynamic-form>

    </ng-container>
  </app-dialog>
  `
})
export class TransactionComponent {

  appState = inject(AppStateService);
  service = inject(TransactionsService);

  route = inject(ActivatedRoute);
  router = inject(Router);

  formJson = formJson as JsonForm;

  controlOverrides = { group: GroupChoiceComponent };

  defaultNewTransaction = signal<Omit<Transaction, 'id'>>({
    groupId: this.router.getCurrentNavigation()?.extras.state?.['groupId'] ?? '',
    icon: 'AcademicCap',
    date: this.appState.lastSelectedFormattedDate(),
    category: '',
    title: ''
  })

  params = toSignal(this.route.params);
  routerParam = computed(() => this.params()?.['transactionId']);
  isNewTransaction = computed(() => !this.routerParam());
  transaction: Signal<Transaction | Omit<Transaction, 'id'>> = computed(() =>
    this.isNewTransaction() ?
      this.service.transactions()?.find(t => t.id === this.routerParam()) ?? this.defaultNewTransaction() :
      this.defaultNewTransaction()
  );

  public closeDialog(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  public onSave(formValue: object) {

    const transaction: Transaction | Omit<Transaction, 'id'> = {
      ...this.transaction(),
      ...formValue
    };

    if ('date' in formValue && typeof formValue.date === 'string') {
      this.saveLastSelectedDate(formValue.date);
    }

    if ('id' in transaction) {
      this.service.edit$.next(transaction);
    } else {
      this.service.add$.next(transaction);
    }

    this.closeDialog();
  }

  public saveLastSelectedDate(newValue: string) {
    this.appState.lastSelectedFormattedDate.update(previousValue => newValue);
  }
}
