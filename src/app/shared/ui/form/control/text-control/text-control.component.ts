import { Component, ElementRef, Input, ViewChild, forwardRef } from '@angular/core';

import { ControlValueAccessor, FormControlDirective, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-control',
  template: `
      <input class="py-2 px-4 border border-slate-500 rounded"
        [ngModel]="value"
        (ngModelChange)="onValueChange($event)"
        (blur)="onInputBlurred()">
    `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextControlComponent)
    }
  ]
})
export class TextControlComponent implements ControlValueAccessor {
  public value!: string;
  public onChange!: (value: string) => void;
  public onTouched!: () => void;

  public writeValue(value: string): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onValueChange(value: string): void {
    this.writeValue(value);
    this.onChange(value);
  }

  public onInputBlurred(): void {
    this.onTouched();
  }
}
