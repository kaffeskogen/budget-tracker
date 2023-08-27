import { ViewContainerRef } from "@angular/core";
import { JsonFormControl, JsonFormControlType } from "../models/models";
import { FORM_CONTROLS } from "../control";
import { ControlValueAccessor } from "@angular/forms";
import { BaseControlComponent } from "../control/base-control/base-control.component";

export class JsonFormControlFactory {

    private vcr!: ViewContainerRef;
    constructor(vcr: ViewContainerRef) {
        this.vcr = vcr;
    }

    CreateComponent(control: JsonFormControl, overrides?: { [key: string]: BaseControlComponent }): ControlValueAccessor {

        const allControls = Object.assign(FORM_CONTROLS, overrides);

        if (!Object.hasOwn(allControls, control.type)) {
            const component = this.vcr.createComponent(FORM_CONTROLS.notimplemented);
            const instance = component.instance;
            instance.controlType = control.type;
            return instance;
        }

        const componentRef = this.vcr.createComponent(allControls[control.type as JsonFormControlType]);
        const instance = componentRef.instance as ControlValueAccessor;

        const props = Object.keys(control).filter(p => !['id', 'slug', 'name', 'type'].includes(p));
        for (const key of props) {
            if (!Object.hasOwn(instance, key)) {
                continue;
            }
            (instance as any)[key] = control[key as keyof JsonFormControl] as string | null | boolean | number;
        }

        return instance;

    }

}