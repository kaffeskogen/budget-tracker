import { Component, Input, OnInit, computed, inject } from '@angular/core';
import { TableCardService } from './table-card.service';
import { Transaction } from 'src/app/shared/interfaces/Transaction';
import { IconComponents } from 'src/app/shared/icons';

IconComponents

@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
  providers: [TableCardService]
})
export class TableCardComponent<TItem extends object> implements OnInit {
  service = inject(TableCardService);

  @Input() color!: string;
  @Input() groupId!: string;

  ngOnInit(): void {
    this.service.groupId$.next(this.groupId);
  }
}
