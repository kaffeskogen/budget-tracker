import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, fromEvent, map, subscribeOn } from 'rxjs';
import { getCircularArcPathCommand } from './getCircularArcPathCommand';
import { CurrencyFormattedPipe } from '../../pipes/currency-formatted.pipe';

const removeSpecialCharacters = (txt: string) => txt.replace(/[^a-zA-Z0-9\s]/g, '');

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CurrencyFormattedPipe],
  template: `
    <div class="flex w-fill">
      <svg width="200" height="200" class="block mr-8">
        @for (path of paths(); track $index) {
          <path [attr.d]="path.path" [attr.fill]="path.color" class='stroke-slate-200 stroke-2' style="stroke-width: 2;"/>
        }
      </svg>
      <div class="flex-grow flex flex-col justify-center">
        <div class="flex place-content-between">
          <h2 class="text-lg">{{title}}</h2>
          <span>{{totaleValue() | currencyFormatted}}</span>
        </div>
        <div class="flex flex-col w-full">
          @for (item of paths(); track $index) {
            <div class="flex flex-row pb-2 w-full">
              <div class="flex flex-row items-center w-full">
                <div class="w-3 h-3 mr-2 rounded-full flex-grow-0" [style.backgroundColor]="item.color"></div>
                <div class="flex-grow">{{item.label}}</div>
                <div class="text-sm flex-grow-0">{{item.value | currencyFormatted}}</div>
              </div>
            </div>
          }
      </div>
    </div>
  `,
  styles: ``
})
export class GraphComponent {
  
  rangeValue = signal<number>(0);

  @Input() type!: 'piechart';
  @Input() title!: string;
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
      return {path, color: item.color, label: removeSpecialCharacters(item.label), value: item.value};
    });
    return newValue;
  })

  ngOnChanges() {
    this.totaleValue.update(() => this.data.reduce((a,b) => a+b.value, 0));
  }

}
