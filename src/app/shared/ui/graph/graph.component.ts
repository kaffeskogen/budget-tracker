import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, map, subscribeOn } from 'rxjs';
import { getCircularArcPathCommand } from './getCircularArcPathCommand';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [],
  template: `
    <p>
      <svg width="200" height="200">
        @for (path of paths; track $index) {
          <path [attr.d]="path.path" [attr.fill]="path.color" class=' stroke-white stroke-2'/>
        }
      </svg>
    </p>
  `,
  styles: ``
})
export class GraphComponent implements OnChanges {
  
  @ViewChild('range', { static: true }) range!: ElementRef<HTMLInputElement>;

  @Input() type!: 'piechart';
  @Input() data!: {label: string, value: number}[];

  paths: {path: string, color: string}[] = [];

  ngOnChanges() {
    let previousDegree = 0;
    const totale = this.data.reduce((acc, item) => acc + item.value, 0);
    this.paths = this.data.map((item, index) => {
      const degree = (item.value / totale) * 360;
      const path = getCircularArcPathCommand({
        start_angle: previousDegree,
        sweep_angle: degree,
      });
      previousDegree += (degree + 0);
      return {path, color: `hsl(${index * 30}, 100%, 50%)`};
    });
  }
}
