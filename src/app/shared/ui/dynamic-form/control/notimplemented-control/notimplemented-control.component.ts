import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';


@Component({
    selector: 'app-notimplemented-control',
    template: `
    <pre class="px-2 py-4 text-red-700">Control of type \`{{controlType}}\` is not implemented</pre>
  `,
    styles: [],
    standalone: true
})
export class NotimplementedControlComponent implements ControlValueAccessor {
  @Input() controlType: string = "";
  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }
}
