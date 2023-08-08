import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import formJson from './new-transaction.form.json'
import { JsonForm } from 'src/app/shared/ui/form/models/models';

@Component({
  selector: 'app-new-transaction',
  template: `
  <app-dialog (closeDialog)="closeDialog()">
    <ng-container>

      <app-form [form]="formJson"></app-form>

    </ng-container>
  </app-dialog>
  `
})
export class NewTransactionComponent {

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  formJson = formJson as JsonForm;

  public closeDialog(): void {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
