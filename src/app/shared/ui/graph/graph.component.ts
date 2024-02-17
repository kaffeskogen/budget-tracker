import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, fromEvent, map, subscribeOn } from 'rxjs';
import { getCircularArcPathCommand } from './getCircularArcPathCommand';
import { CurrencyFormattedPipe } from '../../pipes/currency-formatted.pipe';

const removeSpecialCharacters = (txt: string) => txt.replace(/[^\sa-zA-Z0-9åäö]/g, '');

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CurrencyFormattedPipe],
  template: `
    <div class="flex w-fill flex-col mb-8">
      <h2 class="text-xl">{{title}}</h2>
      <div class="flex flex-wrap">
        @for (item of paths(); track $index) {
          <div class="inline-block mr-4 mb-2">
            <div class="flex flex-row items-center w-full">
              <div class="w-3 h-3 mr-2 rounded-full" [style.backgroundColor]="item.color"></div>
              <div class="mr-2">{{item.label}}</div>
              <div class="text-sm">{{item.value}}</div>
            </div>
          </div>
        }
      </div>
      <svg class="block mr-8 overflow-auto w-full aspect-square" viewBox="0 0 200 200">
        @for (path of paths(); track $index) {
          <path [attr.d]="path.path" [attr.fill]="path.color" class='stroke-slate-200 stroke-0' style="stroke-width: 2;"/>
        }
      </svg>
      
    </div>
  `,
  styles: ``
})
export class GraphComponent {

  rangeValue = signal<number>(0);

  @Input() type!: 'piechart';
  @Input() title!: string;
  @Input() data!: { label: string, value: number, color: string }[];

  totaleValue = signal(0);
  paths = computed(() => {
    const totale = this.totaleValue();
    if (totale === 0) return [];
    let previousDegree = 0;
    const newValue = this.data.map(item => {
      const degree = (item.value / this.totaleValue()) * 359.99;
      const path = getCircularArcPathCommand({
        start_angle: previousDegree,
        sweep_angle: degree,
      });
      previousDegree += (degree + 0);
      return { path, color: item.color, label: removeSpecialCharacters(item.label), value: Math.round((item.value * 100) / this.totaleValue()) + '%' };
    });
    return newValue;
  })

  ngOnChanges() {
    const totale = this.data.reduce((a, b) => a + b.value, 0);
    this.totaleValue.update(() => totale);
  }

}
