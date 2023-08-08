import { NgModule } from "@angular/core";
import { FormComponent } from "./form.component";
import { TextControlComponent } from './controls/text-control/text-control.component';
import { NumberControlComponent } from './controls/number-control/number-control.component';
import { DateControlComponent } from './controls/date-control/date-control.component';
import { IconControlComponent } from './controls/icon-control/icon-control.component';
import { NotimplementedControlComponent } from './controls/notimplemented-control/notimplemented-control.component';
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        FormComponent,
        TextControlComponent,
        NumberControlComponent,
        DateControlComponent,
        IconControlComponent,
        NotimplementedControlComponent
    ],
    imports: [
        ReactiveFormsModule
    ],
    exports: [
        FormComponent
    ]
})
export class FormModule { }
