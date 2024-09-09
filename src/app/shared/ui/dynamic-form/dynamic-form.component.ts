import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {JsonForm} from './models/models';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {fromEvent} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DynamicControlComponent} from './control/dynamic-control.component';
import {NgIf, NgFor, JsonPipe} from '@angular/common';

@Component({
  selector: 'app-dynamic-form',
  template: `
    <form
      *ngIf="formGroup && formControls"
      [formGroup]="formGroup"
      (ngSubmit)="onSubmit()"
    >
      <div class="relative">
        <app-dynamic-control
          *ngFor="let control of form?.controls"
          [controlOverrides]="controlOverrides"
          [formControl]="formControls[control.slug]"
          [control]="control"
        ></app-dynamic-control>
      </div>

      <div class="flex justify-end">
        <button
          (click)="onCancel.emit()"
          type="button"
          class="rounded px-4 py-2 mt-4 mr-2 border border-slate-400 hover:bg-gray-100 text-gray-800 bg-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded px-4 py-2 mt-4 border bg-sky-700 hover:bg-sky-800 text-white"
        >
          Save
        </button>
      </div>
    </form>
  `,
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    DynamicControlComponent
  ],
})
export class DynamicFormComponent implements OnInit, AfterViewInit {
  @Input() form?: JsonForm;
  @Input() title!: string;
  @Input() defaultValues: {[key: string]: any} | undefined;
  @Input() controlOverrides?: {[key: string]: any};
  @Input() focus?: boolean;
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  mostRight = this.form?.sections.map(section =>
    this.form?.controls
      .filter(control => control.section === section.slug)
      .map(control => section.bounds.x + control.bounds.x)
      .reduce((a, b) => (a >= b ? a : b), 0)
  );

  mostBottom = this.form?.sections.map(section =>
    this.form?.controls
      .filter(control => control.section === section.slug)
      .map(control => section.bounds.y + control.bounds.y)
      .reduce((a, b) => (a >= b ? a : b), 0)
  );

  formBuilder = new FormBuilder();
  formControls?: {[key: string]: FormControl};
  formGroup?: FormGroup;

  private readonly el = inject(ElementRef);

  constructor() {
    fromEvent(document, 'keydown')
      .pipe(takeUntilDestroyed())
      .subscribe(
        e =>
          (e as any as KeyboardEvent).key === 'Escape' && this.onCancel.emit()
      );
  }

  ngAfterViewInit(): void {
    if (!this.focus) {
      return;
    }
    this.el.nativeElement.querySelector('input')?.focus();
  }

  public ngOnInit(): void {
    this.formControls = this.form?.controls.reduce((a, b) => {
      a[b.slug] = new FormControl(b.defaultValue);
      return a;
    }, {} as {[key: string]: FormControl}) || {};

    this.formGroup = this.formBuilder.group(this.formControls);

    if (this.defaultValues) {
      this.formGroup.patchValue(this.defaultValues);
    }
  }

  public onSubmit() {
    const value = this.formGroup?.getRawValue();
    this.formGroup?.disable();
    this.onSave.emit(value);
  }
}
