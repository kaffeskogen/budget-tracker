import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { DialogComponent } from 'src/app/shared/ui/dialog/dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DialogComponent, RouterOutlet],
  template: `
    <app-dialog (closeDialog)="closeDialog()">
      <ng-container>
        <div class="pb-4">

          <div class="pb-2">
            <h2 class="text-xl mt-2 mb-2 font-semibold">Settings</h2>
          </div>

          <router-outlet></router-outlet>

        </div>
      </ng-container>
    </app-dialog>
  `,
  styles: ``
})
export class SettingsComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);

  public closeDialog(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
