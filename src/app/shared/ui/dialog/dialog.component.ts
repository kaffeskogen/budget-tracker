import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'app-dialog',
    template: `<ng-template cdkPortal>
        <div class="w-full px-8 py-4 bg-white rounded shadow">
            <ng-content></ng-content>
        </div>
    </ng-template>
`,
    encapsulation: ViewEncapsulation.None,
})
export class DialogComponent implements AfterViewInit {
    @ViewChild(CdkPortal) public readonly portal?: CdkPortal;
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
        this.overlayRef.backdropClick().subscribe(() => {
            this.closeDialog.emit();
        });
    }

    public ngAfterViewInit(): void {
        if (!this.portal) {
            setInterval(() => {
                console.log('test', this.portal);
            }, 500)
        }
        this.overlayRef?.attach(this.portal);
    }

    public ngOnDestroy(): void {
        // parent destroys this component, this component destroys the overlayRef
        this.overlayRef?.detach();
        this.overlayRef?.dispose();
    }
}
