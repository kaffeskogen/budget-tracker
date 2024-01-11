import { Component, HostBinding, Signal, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import formJson from './transaction.form.json'
import { GroupChoiceComponent } from './controls/group-choice.component';
import { AppStateService } from 'src/app/shared/data-access/app-state.service';
import { Transaction } from 'src/app/shared/interfaces/Transaction';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionsService } from 'src/app/shared/data-access/transactions.service';
import { JsonForm } from 'src/app/shared/ui/dynamic-form/models/models';
import { DynamicFormComponent } from '../../shared/ui/dynamic-form/dynamic-form.component';
import { NgIf } from '@angular/common';
import { DialogComponent } from '../../shared/ui/dialog/dialog.component';
import { OutlineIconsModule } from '@dimaslz/ng-heroicons';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { ConnectionPositionPair } from '@angular/cdk/overlay';

@Component({
    selector: 'new-transaction',
    template: `
  <app-dialog (closeDialog)="closeDialog()">
    <ng-container>


      <div class="flex place-content-between items-center">
        <h2 class="text-xl mt-2 mb-4 font-semibold">{{isNewTransaction() ? 'New transaction' : 'Editing transaction'}}</h2>

        <button [cdkMenuTriggerFor]="menu" [cdkMenuPosition]="menuPositions" *ngIf="!isNewTransaction()">
          <ellipsis-horizontal-outline-icon />
        </button>

        <ng-template #menu>
          <div class="flex flex-col bg-white rounded shadow-sm p-4" cdkMenu>
            <button cdkMenuItem (click)="deleteTransaction()">Delete</button>
          </div>
        </ng-template>
      </div>
      
      <app-dynamic-form
        *ngIf="formJson"
        [form]="formJson"
        [controlOverrides]="controlOverrides"
        [defaultValues]="transaction()"
        (onCancel)="closeDialog()"
        (onSave)="onSave($event)">
      </app-dynamic-form>

    </ng-container>
  </app-dialog>
  `,
    standalone: true,
    imports: [DialogComponent, NgIf, DynamicFormComponent, OutlineIconsModule, CdkMenuTrigger, CdkMenu, CdkMenuItem]
})
export class TransactionComponent {

  appState = inject(AppStateService);
  service = inject(TransactionsService);

  route = inject(ActivatedRoute);
  router = inject(Router);

  formJson = formJson as JsonForm;

  menuPositions = [
    new ConnectionPositionPair(
      { originX: 'end', originY: 'bottom' },
      { overlayX: 'end', overlayY: 'top' }
    ),
  ];

  controlOverrides = { group: GroupChoiceComponent };

  defaultNewTransaction = signal<Omit<Transaction, 'id'>>({
    groupId: this.router.getCurrentNavigation()?.extras.state?.['groupId'] ?? '',
    icon: 'AcademicCap',
    date: this.appState.lastSelectedFormattedDate(),
    category: '',
    title: ''
  })

  params = toSignal(this.route.params);
  routerParam = computed<string>(() => this.params()?.['transactionId']);
  isNewTransaction = computed<boolean>(() => !this.routerParam());
  transaction: Signal<Transaction | Omit<Transaction, 'id'>> = computed(() => {
    const allTransactions = this.service.transactions();
    const routerParam = this.routerParam();
    const thisTransaction = allTransactions?.find(t => t.id === routerParam);
    return thisTransaction || this.defaultNewTransaction();
  });

  public deleteTransaction() {
    const transaction = this.transaction();
    if (!('id' in transaction)) {
      return;
    }
    this.service.remove$.next(transaction);
    this.closeDialog();
  }

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
