import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


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
    PortalModule, OverlayModule
  ]
})
export class DialogComponent implements OnInit, OnDestroy {

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
    height: this.smallscreen() ? 'calc(100vh - 100px)' : 'auto',
    width: '100%',
    maxHeight: 'calc(100vh - 100px)',
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
