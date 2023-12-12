import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
        <a href="{{item.id}}" data-qa="link" *ngFor="let item of service.groups()">Home</a>
    </p>
  `,
  styles: [
  ]
})
export class SidenavComponent {
  service = inject(TransactionGroupsService);
}
