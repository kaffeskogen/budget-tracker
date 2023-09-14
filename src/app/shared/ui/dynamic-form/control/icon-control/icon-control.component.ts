import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponents } from 'src/app/shared/icons';

@Component({
  selector: 'app-icon-control',
  template: `
    <button (click)="isOpen = !isOpen" cdkOverlayOrigin #trigger="cdkOverlayOrigin" role="button" type="button" class="border rounded inline-block border-slate-400 py-2 px-4 box-border bg-white hover:bg-gray-50 active:bg-transparent">
      <app-icon [iconName]="value" [color]="'blue'" [size]="24"></app-icon>
    </button>
    <ng-template
      cdkConnectedOverlay immitateWidth
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen"
      [cdkConnectedOverlayBackdropClass]="'bg-transparent'"
      [cdkConnectedOverlayHasBackdrop]="true"
      [cdkConnectedOverlayPositions]="positions"
      (backdropClick)="isOpen = false">

      <div class="border rounded inline-block border-slate-400 box-border w-full">

        <app-icon-picker></app-icon-picker>

      </div>

    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconControlComponent),
      multi: true
    }
  ]
})
export class IconControlComponent implements ControlValueAccessor {

  public value!: keyof typeof IconComponents;
  public disabled = false;
  public isOpen = true;
  public onChange!: (value: string) => void;
  public onTouched!: () => void;

  public positions = [
    new ConnectionPositionPair({
      originX: 'start',
      originY: 'top'
    }, {
      overlayX: 'start',
      overlayY: 'top'
    },
      0,
      0)
  ];

  public writeValue(value: keyof typeof IconComponents): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onValueChange(value: keyof typeof IconComponents): void {
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
