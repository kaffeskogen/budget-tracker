import { ConnectionPositionPair, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dialog',
  template: `<ng-template cdkPortal>
        <div class="w-full max-h-screen overflow-y-scroll px-8 py-4 bg-slate-100 rounded shadow">
            <ng-content></ng-content>
        </div>
    </ng-template>
  `,
  standalone: true,
  providers: [
    { provide: Window, useValue: window }
  ],
  imports: [
    PortalModule
  ]
})
export class DialogComponent implements OnInit {
  @ViewChild(CdkPortal, { static: true }) public readonly portal?: CdkPortal;

  @Output() public readonly closeDialog = new EventEmitter<void>();

  window = inject(Window);
  overlay = inject(Overlay);
  elementRef = inject(ElementRef);

  smallscreen = computed<boolean>(() => this.window.innerWidth < 500)
  positionStrategy = computed(() =>
    this.smallscreen() ?
      this.overlay
        .position()
        .global()
        .centerHorizontally()
        .bottom('0')
      :
      this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
  )

  private readonly overlayConfig = new OverlayConfig({
    hasBackdrop: true,
    positionStrategy: this.positionStrategy(),
    scrollStrategy: this.overlay.scrollStrategies.block(),
    maxWidth: 500,
    width: '100%',
    maxHeight: '100vh',
  });
  private overlayRef = this.overlay.create(this.overlayConfig);

  constructor() {
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
