import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import formJson from './new-transaction.form.json'
import { JsonForm } from 'src/app/shared/ui/form/models/models';
import { GroupChoiceComponent } from './group-choice.component';
import { BaseControlComponent } from 'src/app/shared/ui/form/control/base-control/base-control.component';
import { AppStateService } from 'src/app/shared/data-access/app-state.service';

@Component({
  selector: 'app-new-transaction',
  template: `
  <app-dialog (closeDialog)="closeDialog()">
    <ng-container>

      <app-form
        *ngIf="formJson"
        [form]="formJson"
        [controlOverrides]="controlOverrides"
        [defaultValues]="defaultValues"
        (onCancel)="closeDialog()"
        (onSave)="onSave($event)"></app-form>

    </ng-container>
  </app-dialog>
  `
})
export class NewTransactionComponent {

  appState = inject(AppStateService);

  route = inject(ActivatedRoute);
  router = inject(Router);

  formJson = formJson as JsonForm;

  defaultValues: { [key: string]: string | number | boolean } | undefined = {};

  controlOverrides = { group: GroupChoiceComponent };



  constructor() {
    const transactionId = this.route.snapshot.

      this.defaultValues = this.transactionId ? 
  }

  public newTransactionDefaultValue() {
    return {
      ...this.router.getCurrentNavigation()?.extras.state,
      ['date']: this.appState.lastSelectedFormattedDate()
    }
  }

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
