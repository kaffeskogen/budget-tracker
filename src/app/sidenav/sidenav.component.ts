import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}"
      data-qa="link"
      class="sidenav-item">
        Home
    </a>
    <a [routerLink]="['g', item.id]" routerLinkActive="active"
      data-qa="link"
      *ngFor="let item of service.groups()"
      [ngStyle]="{color: item.color, borderColor: item.color}"
      class="sidenav-item">
        {{item.name}}
    </a>
  `,
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  service = inject(TransactionGroupsService);
}
