import { NgIf } from '@angular/common';
import { Component, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionGroupsService } from 'src/app/shared/data-access/transaction-groups.service';
import { Group } from 'src/app/shared/interfaces/Group';
import { DialogComponent } from 'src/app/shared/ui/dialog/dialog.component';
import { DynamicFormComponent } from 'src/app/shared/ui/dynamic-form/dynamic-form.component';
import { JsonForm } from 'src/app/shared/ui/dynamic-form/models/models';

@Component({
  selector: 'app-group-settings',
  standalone: true,
  imports: [DialogComponent, DynamicFormComponent, NgIf],
  template: `
    <app-dialog (closeDialog)="closeDialog()">
      <ng-container>
        <app-dynamic-form *ngIf="group()" [defaultValues]="group()" [form]="form()" (onCancel)="closeDialog()" (onSave)="onSave($event)"></app-dynamic-form>
      </ng-container>
    </app-dialog>
  `,
  styles: ``
})
export class GroupSettingsComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  params = toSignal(this.route.params);
  routerParam = computed<string>(() => this.params()?.['groupId']);

  service = inject(TransactionGroupsService)
  group = computed<Group|undefined>(() => this.service.group(this.routerParam())());

  form: Signal<JsonForm> = computed(() => ({
    controls: [{
      name: 'Name',
      slug: 'name',
      type: 'text',
      bounds: {
        height: 0,
        width: 0,
        x: 0,
        y: 0
      },
      defaultValue: this.group()?.name
    }],
    sections: []
  }));


  public onSave(data: any): void {
    this.service.edit$.next({ ...this.group(),  ...data });
    this.closeDialog();
  }

  public closeDialog(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
