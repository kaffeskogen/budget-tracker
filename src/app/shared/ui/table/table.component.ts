import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from '@angular/core';
import { TableRowTemplateDirective } from './table-row-template.directive';
import { TableHeaderTemplateDirective } from './table-header-template.directive';
import { NgTemplateOutlet, NgFor, KeyValuePipe } from '@angular/common';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [NgTemplateOutlet, NgFor, KeyValuePipe]
})
export class TableComponent<TItem extends object> {
  @Input() color!: string;
  @Input() data!: TItem[];
  @ContentChild(TableHeaderTemplateDirective, { read: TemplateRef })
  headers?: TemplateRef<any>;
  @ContentChild(TableRowTemplateDirective, { read: TemplateRef })
  rows?: TemplateRef<any>;
}

