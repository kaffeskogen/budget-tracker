import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-text-control',
    template: `
      <input class="app-input"
        [ngModel]="value"
        (ngModelChange)="onValueChange($event)"
        (blur)="onInputBlurred()"
        [disabled]="disabled">
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextControlComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [FormsModule]
})
export class TextControlComponent implements ControlValueAccessor {

  public value!: string;
  public disabled = false;
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

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
