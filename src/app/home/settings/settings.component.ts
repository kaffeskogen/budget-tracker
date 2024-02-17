import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { DialogComponent } from 'src/app/shared/ui/dialog/dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DialogComponent],
  template: `
    <app-dialog (closeDialog)="closeDialog()">
      <ng-container>
        <div class="pb-4">
          <h2 class="text-xl mt-2 mb-4 font-semibold">Settings</h2>
          <h3 class="mb-2">Save to the cloud</h3>
          <button class="rounded-md bg-white p-4 border select-none hover:bg-slate-50 cursor-pointer" (click)="service.login()">
            Sign in with Google
          </button>
        </div>
      </ng-container>
    </app-dialog>
  `,
  styles: ``
})
export class SettingsComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);

  service = inject(AuthService);

  public closeDialog(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
