import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { ToastService } from './shared/ui/toast/toast.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="wrapper">
        <router-outlet></router-outlet>
    </div>
    <app-toast></app-toast>
    `,
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, SidenavComponent, ToastComponent],
  providers: [ToastService]
})
export class AppComponent {
  title = 'budget-tracker';
}
