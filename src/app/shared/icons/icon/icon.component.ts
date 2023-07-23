import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IconComponents } from 'src/app/shared/icons';

@Component({
  selector: 'app-icon',
  template: `<div #renderIconAfterThisElement></div>`,
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @ViewChild("renderIconAfterThisElement", { read: ViewContainerRef, static: true }) renderIconAfterThisElement!: ViewContainerRef;

  @Input() iconName!: keyof typeof IconComponents;
  @Input() color!: string;

  ngOnInit(): void {
    const el = this.renderIconAfterThisElement.createComponent(IconComponents[this.iconName]);
    el.instance.color = this.color;
  }

}
