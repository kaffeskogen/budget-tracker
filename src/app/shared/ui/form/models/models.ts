import { ControlValueAccessor } from "@angular/forms";
import { FORM_CONTROLS } from "../controls";

export type JsonFormControlType = keyof typeof FORM_CONTROLS;

export interface JsonForm {
    controls: JsonFormControl[];
    sections: JsonFormSection[];
}

export interface JsonFormSection {
    name: string;
    id: string;
    slug: string;
    controls: string[];
}

export interface JsonFormControl {
    type: JsonFormControlType;
    id: string;
    slug: string;
    name: string;
    defaultValue?: string | null;
}
