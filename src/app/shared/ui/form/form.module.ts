import { NgModule } from "@angular/core";
import { FormComponent } from "./form.component";
import { TextControlComponent } from './control/text-control/text-control.component';
import { NumberControlComponent } from './control/number-control/number-control.component';
import { DateControlComponent } from './control/date-control/date-control.component';
import { IconControlComponent } from './control/icon-control/icon-control.component';
import { NotimplementedControlComponent } from './control/notimplemented-control/notimplemented-control.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ControlComponent } from './control/control.component';

@NgModule({
    declarations: [
        FormComponent,
        TextControlComponent,
        NumberControlComponent,
        DateControlComponent,
        IconControlComponent,
        NotimplementedControlComponent,
        ControlComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        FormComponent
    ]
})
export class FormModule { }
