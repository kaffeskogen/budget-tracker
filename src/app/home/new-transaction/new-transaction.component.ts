import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  ngOnInit() {
    // console.log('done');
  }

  public closeDialog(): void {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
