import { NgIf } from '@angular/common';
import { Component, Signal, computed, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionGroupsService } from 'src/app/shared/data-access/transaction-groups.service';
import { DialogComponent } from 'src/app/shared/ui/dialog/dialog.component';
import { DynamicFormComponent } from 'src/app/shared/ui/dynamic-form/dynamic-form.component';
import { JsonForm, JsonFormControl } from 'src/app/shared/ui/dynamic-form/models/models';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [DialogComponent, DynamicFormComponent, NgIf],
  template: `
    <app-dialog (closeDialog)="closeDialog()">
      <ng-container>
        <app-dynamic-form [form]="form()" (onCancel)="closeDialog()" (onSave)="onSave($event)"></app-dynamic-form>
      </ng-container>
    </app-dialog>
  `,
  styles: ``
})
export class CreateGroupComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  groupService = inject(TransactionGroupsService);

  form: Signal<JsonForm> = computed(() => ({
    controls: [
      {
        name: 'Slug',
        slug: 'id',
        type: 'text',
        bounds: {
          height: 0,
          width: 0,
          x: 0,
          y: 0
        }
      } ,
      {
        name: 'Name',
        slug: 'name',
        type: 'text',
        bounds: {
          height: 0,
          width: 0,
          x: 0,
          y: 0
        }
      },
      {
        name: 'Color',
        slug: 'color',
        type: 'text',
        bounds: {
          height: 0,
          width: 0,
          x: 0,
          y: 0
        }
      },
    ] satisfies JsonFormControl[],
    sections: []
  }));

  public onSave(data: any): void {
    this.groupService.add$.next({ ...data });
    this.closeDialog();
  }

  public closeDialog(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
