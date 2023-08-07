import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import formJson from './new-transaction.form.json'

@Component({
  selector: 'app-new-transaction',
  template: `
  <app-dialog (closeDialog)="closeDialog()">
    <ng-container>Hello world!</ng-container>
  </app-dialog>
  `
})
export class NewTransactionComponent implements OnInit {

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  constructor() {
    formJson.controls[1].
  }

  ngOnInit() {
    // console.log('done');
  }

  public closeDialog(): void {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
