import { Component, ComponentRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { IconComponents } from 'src/app/shared/icons';

@Component({
  selector: 'app-icon',
  template: `<div #renderIconAfterThisElement></div>`,
  styleUrls: ['./icon.component.scss'],
  standalone: true
})
export class IconComponent implements OnChanges {
  @ViewChild("renderIconAfterThisElement", { read: ViewContainerRef, static: true }) renderIconAfterThisElement!: ViewContainerRef;

  @Input() iconName!: keyof typeof IconComponents;
  @Input() color!: string;
  @Input() size: number = 24;

  previousElement: ComponentRef<unknown> | null = null;

  ngOnChanges(): void {
    const iconCmpt = IconComponents[this.iconName];
    if (!iconCmpt) {
      this.renderIconAfterThisElement.createComponent(IconComponents.Stop)
      return;
    }

    if (this.previousElement) {
      this.previousElement.destroy();
    }

    const el = this.renderIconAfterThisElement.createComponent(iconCmpt);
    el.instance.color = this.color;
    el.instance.size = this.size;

    this.previousElement = el;
  }

}
