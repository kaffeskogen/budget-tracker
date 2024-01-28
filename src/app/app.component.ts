import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { ToastService } from './shared/ui/toast/toast.service';

@Component({
  selector: 'app-root',
  template: `
    <app-sidenav class="sidenav"></app-sidenav>
    <div class="wrapper">
        <router-outlet></router-outlet>
    </div>
    <app-toast>Test</app-toast>
    `,
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, SidenavComponent, ToastComponent],
  providers: [ToastService]
})
export class AppComponent implements OnInit {
  title = 'budget-tracker';

  service = inject(ToastService);
  ngOnInit(): void {
    for (let i = 0; i < 1000; i++) {
      setTimeout(() => {
        this.service.add({ content: 'Hello world ', action: { label: 'Undo', click: () => {} } });
      }, i * 1100);
    }
  }

}
