import { Component, Input, OnInit, ViewContainerRef, inject } from '@angular/core';
import { JsonForm } from './models/models';
import { JsonFormControlFactory } from './utils/json-form-control-factory';
import { FORM_CONTROLS } from './controls';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() form!: JsonForm;

  vcr = inject(ViewContainerRef);
  fcf = new JsonFormControlFactory(this.vcr);

  fb = new FormBuilder();
  fc = this.fb.control('Test');

  public ngOnInit(): void {

    const componentRef = this.vcr.createComponent(FORM_CONTROLS.text);


    // for (const control of this.form.controls) {
    //   const instance = this.fcf.CreateComponent(control);
    //   // instance.form
    // }
  }

}
