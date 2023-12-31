import { Component, Injector, Input, ViewChild, ViewContainerRef, forwardRef, inject } from '@angular/core';
import { JsonFormControl } from '../models/models';
import { JsonFormControlFactory } from '../utils/json-form-control-factory';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
    selector: 'app-dynamic-control',
    template: `
  <label class="flex flex-col mt-4">
    <small class="ml-4">{{control.name}}</small>
    <ng-container #vc></ng-container>
  </label>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DynamicControlComponent),
            multi: true
        }
    ],
    standalone: true
})
export class DynamicControlComponent implements ControlValueAccessor {

  injector = inject(Injector);

  @Input() control!: JsonFormControl;
  @Input() controlOverrides?: { [key: string]: any };

  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;
  fcf?: JsonFormControlFactory;

  public ngOnInit() {
    const ngControl = this.injector.get(NgControl);
    const factory = new JsonFormControlFactory(this.vc);
    const component = factory.CreateComponent(this.control, this.controlOverrides);
    ngControl.valueAccessor = component;
  }

  writeValue(evt: KeyboardEvent) {
  }

  registerOnChange(fn: any) {
  }

  registerOnTouched(fn: any) {
  }

} 
