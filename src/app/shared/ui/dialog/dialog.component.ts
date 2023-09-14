import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { Component, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dialog',
  template: `<ng-template cdkPortal>
        <div class="w-full px-8 py-4 bg-white rounded shadow">
            <ng-content></ng-content>
        </div>
    </ng-template>
  `,
  standalone: true,
  imports: [
    PortalModule
  ]
})
export class DialogComponent implements OnInit {
  @ViewChild(CdkPortal, { static: true }) public readonly portal?: CdkPortal;

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
