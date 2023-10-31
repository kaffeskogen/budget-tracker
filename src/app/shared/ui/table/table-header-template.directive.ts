import { Directive, Input } from "@angular/core";

interface TableHeaderTemplateContext<TItem extends object> {
  $implicit: TItem[];
}

@Directive({
    selector: 'ng-template[appTableHeader]',
    standalone: true,
})
export class TableHeaderTemplateDirective<TItem extends object> {
  @Input('appTableHeader') data!: TItem[] | '';

  static ngTemplateContextGuard<TContextItem extends object>(
    dir: TableHeaderTemplateDirective<TContextItem>,
    ctx: unknown
  ): ctx is TableHeaderTemplateContext<TContextItem> {
    return true;
  }
}