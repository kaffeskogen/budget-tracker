import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { NgClass, NgFor } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [PortalModule, NgFor, NgClass],
  animations: [
    trigger(
      'position', 
      [
        transition(
          ':enter', 
          [
            style({ transform: 'translateY({{bottom}}rem)', opacity: 0 }),
            animate('250ms ease-out', 
                    style({ transform: 'translateY({{top}}rem)', opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ transform: 'translateY({{top}}rem)', opacity: 1 }),
            animate('250ms ease-in', 
                    style({ transform: 'translateY({{bottom}}rem)', opacity: 0 }))
          ]
        )
      ]
    )
  ],
  template: `<ng-template cdkPortal>
    <div class="relative mb-2 h-0">
    @for (msg of service.messages(); track msg.id) {
      <div class="absolute bottom-0 w-screen max-w-xs overflow-y-scroll py-4 px-8 mb-2 bg-slate-800 rounded shadow text-white flex place-content-between"
          [@position]="{value:'*', params: { bottom: 4 - (4 * msg.position), top: -4 * msg.position}}"
          [style]="{transform: 'translateY(' + (-4 * msg.position) + 'rem)'}"
          (mouseover)="service.resetTimeout(msg.id)"
          (active)="service.resetTimeout(msg.id)"
          (click)="service.resetTimeout(msg.id)"
          (touchstart)="service.resetTimeout(msg.id)"
          (focus)="service.resetTimeout(msg.id)">
        <div data-qa="message-content">{{msg.content}}</div>
        <button type="button" role="button" (click)="msg.action.click()" class="text-sky-500 hover:text-sky-400 active:text-sky-600 font-semibold">{{msg.action.label}}</button>
      </div>
    }
  </div>
  </ng-template>`,
  styles: ``
})
export class ToastComponent implements OnDestroy, OnInit {

  overlay = inject(Overlay);
  service = inject(ToastService);

  @ViewChild(CdkPortal, { static: true }) public readonly portal?: CdkPortal;

  private overlayRef = this.overlay.create(new OverlayConfig({
    hasBackdrop: false,
    positionStrategy: this.overlay
      .position()
      .global()
      .centerHorizontally()
      .bottom("0"),
    scrollStrategy: this.overlay.scrollStrategies.reposition()
  }));
  
  public ngOnInit(): void {
    this.overlayRef?.attach(this.portal);
  }

  public ngOnDestroy(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
  }
}
