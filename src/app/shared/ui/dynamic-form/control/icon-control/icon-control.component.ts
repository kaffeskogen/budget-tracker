import { ConnectionPositionPair, CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, forwardRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, interval, map } from 'rxjs';
import { IconComponents } from 'src/app/shared/icons';
import { IconPickerComponent } from './icon-picker/icon-picker.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { IconComponent } from '../../../../icons/icon/icon.component';

@Component({
  selector: 'app-icon-control',
  template: `
    <button (click)="isOpen = !isOpen" cdkOverlayOrigin #trigger="cdkOverlayOrigin" role="button" type="button" class="app-input" style="width: auto;">
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

      <div class="border rounded inline-block border-slate-400 box-border w-full" *ngIf="isOpen">

        <app-icon-picker (iconSelected)="onValueChange($event)"></app-icon-picker>

      </div>

    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconControlComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [CdkOverlayOrigin, IconComponent, CdkConnectedOverlay, NgIf, IconPickerComponent, AsyncPipe]
})
export class IconControlComponent implements ControlValueAccessor {

  public value!: keyof typeof IconComponents;
  public disabled = false;
  public isOpen = false;
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
    this.isOpen = false;
  }

  public onInputBlurred(): void {
    this.onTouched();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
