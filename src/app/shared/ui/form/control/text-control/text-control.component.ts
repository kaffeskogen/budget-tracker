import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { ControlValueAccessor, FormControlDirective, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-control',
  template: `
      <input class="py-2 px-4 border border-slate-500 rounded" placeholder="{{placeholder}}" (keyup)="writeValue($event)">
    `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextControlComponent
    }
  ]
})
export class TextControlComponent implements ControlValueAccessor {
  field = "";

  @Input() placeholder: string | null = null;

  onChange: any = () => { }
  onTouch: any = () => { }

  set value(val: string) {
    this.field = val
    this.onChange(val)
    this.onTouch(val)
  }

  writeValue(evt: KeyboardEvent) {
    this.value = (evt.currentTarget as HTMLInputElement).value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onChange = fn
  }
}
