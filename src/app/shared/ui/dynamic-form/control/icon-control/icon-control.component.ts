import { ConnectionPositionPair, CdkOverlayOrigin, CdkConnectedOverlay, ViewportRuler } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef, forwardRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EMPTY, Observable, combineLatest, fromEvent, interval, map, mergeMap, of, startWith } from 'rxjs';
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
      cdkConnectedOverlayBackdropClass="bg-transparent"
      [cdkConnectedOverlayHasBackdrop]="true"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayWidth]="(containerWidth$ | async) || 200"
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

  @ViewChild('trigger', { static: true, read: ElementRef }) trigger!: ElementRef<HTMLButtonElement>;
  @ViewChild(IconPickerComponent, { static: false, read: ElementRef }) iconPicker!: ElementRef<HTMLElement>;

  public value!: keyof typeof IconComponents;
  public disabled = false;
  public onChange!: (value: string) => void;
  public onTouched!: () => void;

  _isOpen = false;
  public get isOpen(): boolean {
    return this._isOpen;
  }
  public set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      // this.trigger.nativeElement.scrollIntoView();
      setTimeout(() => {
        this.iconPicker.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 650);
    }
  }

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

  public onInputFocused(): void {
    
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  /**
   * Set the width of the overlay to the width of the container
   */
  viewportRuler = inject(ViewportRuler);
  viewContainerRef = inject(ViewContainerRef);
  containerWidth$: Observable<number | string> = this.viewportRuler.change()
    .pipe(
      startWith(null),
      map(() => this.viewContainerRef.element.nativeElement.getBoundingClientRect().width)
    );

}
