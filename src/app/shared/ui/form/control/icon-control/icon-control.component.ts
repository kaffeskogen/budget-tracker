import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-icon-control',
  template: `
    <p>
      icon-control works!

      
    </p>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconControlComponent),
      multi: true
    }
  ]
})
export class IconControlComponent {


}
