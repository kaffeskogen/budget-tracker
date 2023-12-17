import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a href="{{item.id}}"
      data-qa="link"
      *ngFor="let item of service.groups()"
      class="block px-4 py-3 hover:bg-slate-300 font-semibold">
        Home
    </a>
  `,
  styles: [
  ]
})
export class SidenavComponent {
  service = inject(TransactionGroupsService);
}
