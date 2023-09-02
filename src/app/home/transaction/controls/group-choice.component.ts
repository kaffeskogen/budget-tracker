import { Component, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/shared/data-access/api.service';

@Component({
  selector: 'app-group-choice',
  template: `
    <select class="py-2 px-3 border border-slate-400 rounded block w-full"
        *ngIf="value"
        [(ngModel)]="value.id"
        (ngModelChange)="onValueChange($event)"
        (blur)="onInputBlurred()"
        [disabled]="disabled">
      <option *ngFor="let group of $groups|async" [value]="group.id">{{group.name}}</option>
    </select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useValue: forwardRef(() => GroupChoiceComponent)
    }
  ]
})
export class GroupChoiceComponent implements ControlValueAccessor {

  api = inject(ApiService);
  $groups = this.api.$groups;

  public value!: { id: string; text: string };
  public disabled = false;
  public onChange!: (value: string) => void;
  public onTouched!: () => void;

  public async writeValue(value: string): Promise<void> {
    const allGroups = await lastValueFrom(this.$groups);
    const group = allGroups.find(g => g.name === value);
    this.value = group ?
      { id: group.id, text: group.name } :
      { id: value, text: value };
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onValueChange(value: string): void {
    this.writeValue(value);
    this.onChange(value);
  }

  public onInputBlurred(): void {
    this.onTouched();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
