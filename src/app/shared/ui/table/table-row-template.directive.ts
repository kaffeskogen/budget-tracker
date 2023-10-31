import { Directive, Input } from "@angular/core";

interface TableRowTemplateContext<TItem extends object> {
  $implicit: TItem;
}

@Directive({
    selector: 'ng-template[appTableRow]',
    standalone: true,
})
export class TableRowTemplateDirective<TItem extends object> {
  @Input('appTableRow') data!: TItem[];

  static ngTemplateContextGuard<TContextItem extends object>(
    dir: TableRowTemplateDirective<TContextItem>,
    ctx: unknown
  ): ctx is TableRowTemplateContext<TContextItem> {
    return true;
  }
}