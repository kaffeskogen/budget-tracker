import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../shared/icons/icon/icon.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}"
      class="sidenav-item">
        <app-icon iconName="Home" [size]="16" color="black" class="block mr-1"></app-icon>
        <span>Home</span>
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
