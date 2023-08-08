import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';


@Component({
  selector: 'app-notimplemented-control',
  template: `
    <pre class="px-2 py-4 text-red-700">Control of type {{controlType}} is not implemented</pre>
  `,
  styles: [
  ]
})
export class NotimplementedControlComponent implements ControlValueAccessor {
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
  @Input() controlType: string = "";
}
