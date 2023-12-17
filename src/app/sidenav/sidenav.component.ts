import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a routerLink="/" routerLinkActive="bg-slate-200" [routerLinkActiveOptions]="{exact: true}"
      data-qa="link"
      class="block px-8 py-4 hover:bg-slate-200 font-semibold box-border">
        Home
    </a>
    <a [routerLink]="['g', item.id]" routerLinkActive="bg-slate-200"
      data-qa="link"
      *ngFor="let item of service.groups()"
      [ngStyle]="{color: item.color}"
      class="block px-8 py-4 hover:bg-slate-200 font-semibold box-border">
        {{item.name}}
    </a>
  `,
  styles: [
  ]
})
export class SidenavComponent {
  service = inject(TransactionGroupsService);
}
