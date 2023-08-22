import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'app-number-control',
  template: `
      <input class="py-2 px-4 border border-slate-500 rounded w-80"
        type="number"
        [ngModel]="value"
        (ngModelChange)="onValueChange($event)"
        (blur)="onInputBlurred()">
    `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberControlComponent)
    }
  ]
})
export class NumberControlComponent {
  public value!: number;
  public onChange!: (value: number) => void;
  public onTouched!: () => void;

  public writeValue(value: number): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onValueChange(value: number): void {
    this.writeValue(value);
    this.onChange(value);
  }

  public onInputBlurred(): void {
    this.onTouched();
  }
}
