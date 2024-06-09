import { AfterViewInit, Component, ElementRef, Output, ViewChild, computed, signal, EventEmitter, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, distinctUntilChanged, map } from 'rxjs';
import { IconComponents } from 'src/app/shared/icons';
import { IconComponent } from '../../../../../icons/icon/icon.component';
import { NgFor, NgIf } from '@angular/common';

type IconName = keyof typeof IconComponents;

@Component({
    selector: 'app-icon-picker',
    styleUrl: './icon-picker.component.scss',
    template: `
  <div class="bg-white border rounded inline-block border-slate-300 box-border w-full overflow-hidden">
    <input class="bg-white pt-2 pb-1.5 px-4 outline-none w-full border-b-sky-700 border-b-2"
        placeholder="Search icon"
        (input)="inputValue$.next($event)"
        #inputElement>
    <div class="h-[300px] overflow-y-scroll">
      <button type="button" role="button" (click)="iconSelected.emit(icon)" *ngFor="let icon of filteredIcons()" class="px-2 py-1 flex w-full hover:bg-slate-50 active:bg-white">
        <app-icon [color]="color || 'black'" [iconName]="icon" [size]="32" class="block mr-2"></app-icon>
        <span>{{icon}}</span>
      </button>
    </div>
    <div class="p-2" *ngIf="showNoResultsText()"><i>No results</i></div>
  </div>
  `,
    standalone: true,
    imports: [NgFor, IconComponent, NgIf]
})
export class IconPickerComponent implements AfterViewInit {

  public readonly ALL_ICONS = signal<IconName[]>(Object.keys(IconComponents) as IconName[]);

  @ViewChild("inputElement", { static: true }) inputRef!: ElementRef<HTMLInputElement>;

  @Output() public readonly iconSelected = new EventEmitter<IconName>();
  @Input() public color?: string;

  inputValue$: Subject<Event> = new Subject();

  searchValue = signal<string>("");

  selectionIdx = signal<number>(0);

  filteredIcons = computed(() => {
    const searchValue = this.searchValue()?.trim()?.toLowerCase();
    if (!searchValue)
      return this.ALL_ICONS();
    return this.ALL_ICONS().filter(i => i.toLowerCase().includes(searchValue))
  });

  showNoResultsText = computed(() => !this.filteredIcons().length)

  selectedIcon = computed(() => this.filteredIcons()?.[this.selectionIdx()]);

  constructor() {
    this.inputValue$
      .pipe(
        map(() => this.inputRef.nativeElement.value),
        takeUntilDestroyed(),
        distinctUntilChanged())
      .subscribe(
        newValue => this.searchValue.update(oldValue => newValue)
      );
  }

  ngAfterViewInit(): void {
    this.inputRef.nativeElement?.focus();
  }

  stopPropagination(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

}
