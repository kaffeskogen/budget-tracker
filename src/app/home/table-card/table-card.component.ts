import { Component, Input, OnInit, inject } from '@angular/core';
import { TableCardService } from './table-card.service';
import { Group } from 'src/app/shared/interfaces/Group';
import { style, transition, trigger, animate } from '@angular/animations';

@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
  providers: [TableCardService],
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
export class TableCardComponent<TItem extends object> implements OnInit {
  service = inject(TableCardService);

  @Input() color!: string;
  @Input() group!: Group;

  ngOnInit(): void {
    this.service.groupId$.next(this.group.id);
  }
}
