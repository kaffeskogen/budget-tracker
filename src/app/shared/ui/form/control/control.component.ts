import { Component, Input, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { JsonFormControl } from '../models/models';
import { JsonFormControlFactory } from '../utils/json-form-control-factory';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-control',
  template: `
  <label class="flex flex-col">
    <small>{{control.name}}</small>
    <ng-container #vc></ng-container>
  </label>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ControlComponent,
      multi: true
    }
  ]
})
export class ControlComponent implements ControlValueAccessor {

  @Input() control!: JsonFormControl;

  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;
  fcf?: JsonFormControlFactory;

  public ngOnInit() {
    const factory = new JsonFormControlFactory(this.vc);
    const component = factory.CreateComponent(this.control);
    this.writeValue = component.writeValue.bind(component);
    this.registerOnChange = component.registerOnChange.bind(component);
    this.registerOnChange = component.registerOnChange.bind(component);
  }

  writeValue(evt: KeyboardEvent) {
  }

  registerOnChange(fn: any) {
  }

  registerOnTouched(fn: any) {
  }

} 
