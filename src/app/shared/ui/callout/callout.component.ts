import { OnInit } from '@angular/core';
import { OverlayConfig, Overlay } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { Component, EventEmitter, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-callout',
  template: `
    <p>
      callout works!
    </p>
  `,
  styles: []
})
export class CalloutComponent implements OnInit {
  @ViewChild(CdkPortal, { read: ViewContainerRef, static: true }) public readonly portal?: CdkPortal;
  // the parent is in charge of destroying this component (usually through ngIf or route change)
  @Output() public readonly closeDialog = new EventEmitter<void>();

  private readonly overlayConfig = new OverlayConfig({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically(),
    scrollStrategy: this.overlay.scrollStrategies.block(),
    minWidth: 500,
  });
  private overlayRef = this.overlay.create(this.overlayConfig);

  constructor(private readonly overlay: Overlay) {
    this.overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.closeDialog.emit();
      });
  }

  public ngOnInit(): void {
    this.overlayRef?.attach(this.portal);
  }

  public ngOnDestroy(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
  }
}
