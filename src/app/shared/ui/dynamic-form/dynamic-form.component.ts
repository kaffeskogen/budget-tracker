import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { JsonForm } from './models/models';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dynamic-form',
  template: `
  <form *ngIf="formGroup && formControls" [formGroup]="formGroup" (ngSubmit)="onSubmit()">
    <app-dynamic-control
      *ngFor="let control of form.controls"
      [controlOverrides]="controlOverrides"
      [formControl]="formControls[control.slug]"
      [control]="control"
      ></app-dynamic-control>

      <div class="flex justify-end">
        <button (click)="onCancel.emit()" type="button" class="rounded px-4 py-2 mt-4 mr-2 border border-slate-400 hover:bg-gray-100 text-gray-800">Cancel</button>
        <button type="submit" class="rounded px-4 py-2 mt-4 border bg-sky-700 hover:bg-sky-800 text-white">Save</button>
      </div>
  </form>
`
})
export class DynamicFormComponent implements OnInit, AfterViewInit {
  @Input() form!: JsonForm;
  @Input() defaultValues: { [key: string]: any } | undefined;
  @Input() controlOverrides?: { [key: string]: any };
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  formBuilder = new FormBuilder();
  formControls?: { [key: string]: FormControl };
  formGroup?: FormGroup;


  private readonly el = inject(ElementRef);

  constructor() {
    fromEvent(document, "keyup")
      .pipe(takeUntilDestroyed())
      .subscribe((e) => (e as any as KeyboardEvent).key === 'Escape' && this.onCancel.emit())
  }

  public ngOnInit(): void {
    this.formControls = this.form.controls.reduce((a, b) => {
      a[b.slug] = new FormControl(b.defaultValue);
      return a;
    }, {} as { [key: string]: FormControl })

    this.formGroup = this.formBuilder.group(this.formControls);

    if (this.defaultValues) {
      this.formGroup.patchValue(this.defaultValues);
    }

  }

  public ngAfterViewInit(): void {
    requestAnimationFrame(() => { // wait for angular to render
      this.el.nativeElement.querySelector('input').focus();
    });
  }

  public onSubmit() {
    const value = this.formGroup?.getRawValue();
    this.formGroup?.disable();
    this.onSave.emit(value);
  }
}