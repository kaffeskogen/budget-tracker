import { NgModule } from "@angular/core";
import { DynamicFormComponent } from "./dynamic-form.component";
import { TextControlComponent } from './control/text-control/text-control.component';
import { NumberControlComponent } from './control/number-control/number-control.component';
import { DateControlComponent } from './control/date-control/date-control.component';
import { IconControlComponent } from './control/icon-control/icon-control.component';
import { NotimplementedControlComponent } from './control/notimplemented-control/notimplemented-control.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DynamicControlComponent } from './control/dynamic-control.component';
import { IconPickerComponent } from './control/icon-control/icon-picker/icon-picker.component';
import { IconComponent } from "../../icons/icon/icon.component";
import { CalloutComponent } from "../callout/callout.component";
import { OverlayModule } from "@angular/cdk/overlay";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
    declarations: [
        DateControlComponent,
        DynamicFormComponent,
        IconControlComponent,
        TextControlComponent,
        NumberControlComponent,
        NotimplementedControlComponent,
        DynamicControlComponent,
        IconPickerComponent
    ],
    exports: [
        DynamicFormComponent
    ],
    imports: [
        ScrollingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IconComponent,
        CalloutComponent,
        OverlayModule
    ]
})
export class DynamicFormModule { }
