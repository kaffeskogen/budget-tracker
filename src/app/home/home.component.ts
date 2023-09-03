import { Component, inject } from '@angular/core';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  service = inject(TransactionGroupsService);

}
