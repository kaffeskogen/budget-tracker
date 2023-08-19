import { Component, Input, OnInit, ViewContainerRef, inject } from '@angular/core';
import { JsonForm, JsonFormControl } from './models/models';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  template: `
  <form *ngIf="formGroup && formControls" [formGroup]="formGroup">
    <app-control
      *ngFor="let control of form.controls"
      [formControl]="formControls[control.slug]"
      [control]="control"
      ></app-control>
  </form>
`
})
export class FormComponent implements OnInit {
  @Input() form!: JsonForm;

  formBuilder = new FormBuilder();
  formControls?: { [key: string]: FormControl };
  formGroup?: FormGroup;

  public ngOnInit(): void {
    this.formControls = this.form.controls.reduce((a, b) => {
      a[b.slug] = new FormControl(b.defaultValue);
      return a;
    }, {} as { [key: string]: FormControl })

    this.formGroup = this.formBuilder.group(this.formControls);
  }
}
