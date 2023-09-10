import { DateControlComponent } from "./date-control/date-control.component";
import { IconControlComponent } from "./icon-control/icon-control.component";
import { NotimplementedControlComponent } from "./notimplemented-control/notimplemented-control.component";
import { NumberControlComponent } from "./number-control/number-control.component";
import { TextControlComponent } from "./text-control/text-control.component";

export const FORM_CONTROLS = {
    ["text"]: TextControlComponent,
    ["number"]: NumberControlComponent,
    ["date"]: DateControlComponent,
    ["icon"]: IconControlComponent,
    ["notimplemented"]: NotimplementedControlComponent,
} as const;