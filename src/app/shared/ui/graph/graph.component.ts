import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, fromEvent, map, subscribeOn } from 'rxjs';
import { getCircularArcPathCommand } from './getCircularArcPathCommand';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [],
  template: `
    <div>
      <svg width="200" height="200">
        @for (path of paths(); track $index) {
          <path [attr.d]="path.path" [attr.fill]="path.color" class='stroke-white stroke-2'/>
        }
      </svg>
      </div>
  `,
  styles: ``
})
export class GraphComponent {
  
  rangeValue = signal<number>(0);

  @Input() type!: 'piechart';
  @Input() data!: {label: string, value: number, color: string}[];
  
  totaleValue = signal(0);
  paths = computed(() => {
    let previousDegree = 0;
    const newValue = this.data.map(item => {
      const degree = (item.value / this.totaleValue()) * 360;
      const path = getCircularArcPathCommand({
        start_angle: previousDegree,
        sweep_angle: degree,
      });
      previousDegree += (degree + 0);
      return {path, color: item.color};
    });
    return newValue;
  })

  ngOnChanges() {
    this.totaleValue.update(() => this.data.reduce((a,b) => a+b.value, 0));
  }

}
