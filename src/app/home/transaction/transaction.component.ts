import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import formJson from './transaction.form.json'
import { JsonForm } from 'src/app/shared/ui/form/models/models';
import { GroupChoiceComponent } from './controls/group-choice.component';
import { AppStateService } from 'src/app/shared/data-access/app-state.service';
import { ApiService } from 'src/app/shared/data-access/api.service';
import { Transaction } from 'src/app/shared/interfaces/Transaction';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'new-transaction',
  template: `
  <app-dialog (closeDialog)="closeDialog()">
    <ng-container>

      <app-form
        *ngIf="formJson"
        [form]="formJson"
        [controlOverrides]="controlOverrides"
        [defaultValues]="transaction()"
        (onCancel)="closeDialog()"
        (onSave)="onSave($event)"></app-form>

    </ng-container>
  </app-dialog>
  `
})
export class TransactionComponent {

  appState = inject(AppStateService);
  api = inject(ApiService);

  route = inject(ActivatedRoute);
  router = inject(Router);

  formJson = formJson as JsonForm;

  controlOverrides = { group: GroupChoiceComponent };

  defaultNewTransaction = signal<Partial<Transaction>>({
    ...this.router.getCurrentNavigation()?.extras.state,
    date: this.appState.lastSelectedFormattedDate()
  })

  params = toSignal(this.route.params);
  routerParam = computed(() => this.params()?.['transactionId'])
  transactions = toSignal(this.api.$transactions);
  transaction = computed(() =>
    this.routerParam() && this.transactions() ?
      this.transactions()?.find(t => t.id === this.routerParam()) :
      this.defaultNewTransaction()
  );

  public closeDialog(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  public onSave(formValue: any) {
    if (typeof formValue.date === 'string') {
      this.saveLastSelectedDate(formValue.date)
    }
  }

  public saveLastSelectedDate(newValue: string) {
    this.appState.lastSelectedFormattedDate.update(previousValue => newValue);
  }
}
