import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TableComponent } from "./table.component";
import { TableRowTemplateDirective } from "./table-row-template.directive";
import { TableHeaderTemplateDirective } from "./table-header-template.directive";

@NgModule({
    imports: [CommonModule],
    declarations: [
        TableComponent,
        TableHeaderTemplateDirective,
        TableRowTemplateDirective,
    ],
    exports: [
        TableComponent,
        TableHeaderTemplateDirective,
        TableRowTemplateDirective,
    ],
})
export class TableComponentModule { }