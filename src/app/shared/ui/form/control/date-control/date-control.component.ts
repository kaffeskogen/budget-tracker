import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'app-date-control',
  template: `
      <input class="py-2 px-4 border border-slate-500 rounded w-80"
        type="date"
        [ngModel]="value"
        (ngModelChange)="onValueChange($event)"
        (blur)="onInputBlurred()"
        [disabled]="disabled">
    `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateControlComponent)
    }
  ]
})
export class DateControlComponent {
  public value!: Date;
  public disabled = false;
  public onChange!: (value: Date) => void;
  public onTouched!: () => void;

  public writeValue(value: Date): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: Date) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onValueChange(value: Date): void {
    this.writeValue(value);
    this.onChange(value);
  }

  public onInputBlurred(): void {
    this.onTouched();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
