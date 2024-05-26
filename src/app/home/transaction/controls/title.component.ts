/* import { NgIf, NgFor } from "@angular/common";
import { Component, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, FormsModule, ControlValueAccessor } from "@angular/forms";

@Component({
    selector: 'app-group-choice',
    template: `
    <select class="app-input"
        *ngIf="value"
        [(ngModel)]="value.id"
        (ngModelChange)="onValueChange($event)"
        (blur)="onInputBlurred()"
        [disabled]="disabled">
      <option *ngFor="let group of service.groups()" [value]="group.id">{{group.name}}</option>
    </select>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useValue: forwardRef(() => TransactionTitleInputComponent)
        }
    ],
    standalone: true,
    imports: [NgIfdfd, FormsModule, NgFor]
})
export class TransactionTitleInputComponent implements ControlValueAccessor {

} */