import { Component } from '@angular/core';
import { Transaction } from '../shared/interfaces/Transaction';
import { Group } from '../shared/interfaces/Group';
import { MOCK_GROUPS } from '../shared/mocks/groups';
import { MOCK_TRANSACTIONS } from '../shared/mocks/transactions';
import * as colors from 'tailwindcss/colors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  groups: Group[] = MOCK_GROUPS;


}
