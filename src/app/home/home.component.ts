import { Component, inject } from '@angular/core';
import { Group } from '../shared/interfaces/Group';
import { MOCK_GROUPS } from '../shared/mocks/groups';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  groups: Group[] = MOCK_GROUPS;

}
