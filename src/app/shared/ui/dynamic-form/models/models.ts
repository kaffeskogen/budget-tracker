import { ControlValueAccessor } from "@angular/forms";
import { FORM_CONTROLS } from "../control";

export type JsonFormControlType = keyof typeof FORM_CONTROLS;

export interface JsonForm {
    controls: JsonFormControl[];
    sections: JsonFormSection[];
}

export interface JsonFormSection {
    name: string;
    slug: string;
    controls: string[];
    bounds: {
        x: number,
        y: number,
        width: number,
        height: number
    }
}

export interface JsonFormControl {
    type: JsonFormControlType;
    slug: string;
    name: string;
    defaultValue?: string | null;
    bounds: {
        x: number,
        y: number,
        width: number,
        height: number
    }
    section?: string;
}
