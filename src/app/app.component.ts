import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterEvent, RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  imports: [RouterOutlet, SidenavComponent, ToastComponent]
})
export class AppComponent {
  title = 'budget-tracker';

  router = inject(Router);

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe(event => {
        document.documentElement.scrollTop = 0;
      });
  }

}
