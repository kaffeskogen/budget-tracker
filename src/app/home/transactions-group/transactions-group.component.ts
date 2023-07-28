import { Component, Input, OnInit, inject } from '@angular/core';
import { TransactionsGroupService } from './transactions-group.service';
import { Group } from 'src/app/shared/interfaces/Group';
import { style, transition, trigger, animate } from '@angular/animations';

@Component({
  selector: 'app-transactions-group',
  templateUrl: './transactions-group.component.html',
  styleUrls: ['./transactions-group.component.scss'],
  providers: [TransactionsGroupService],
  animations: [
    trigger(
      'outAnimation',
      [
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('0.25s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    ),
    trigger(
      'inAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('0.25s ease-out',
              style({ opacity: 1 }))
          ]
        )
      ]
    )
  ]
})
export class TransactionsGroupComponent implements OnInit {
  service = inject(TransactionsGroupService);

  @Input() color!: string;
  @Input() group!: Group;

  ngOnInit(): void {
    this.service.groupId$.next(this.group.id);
  }
}
