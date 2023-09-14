import { AfterViewInit, Component, ElementRef, ViewChild, ViewContainerRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Observable, ReplaySubject, debounce, distinctUntilChanged, fromEvent, map, takeUntil, tap, timer } from 'rxjs';
import { IconComponents } from 'src/app/shared/icons';

type IconName = keyof typeof IconComponents;

@Component({
  selector: 'app-icon-picker',
  template: `
  <div class="max-h-[200px] bg-white overflow-auto px-1 py-2">
    <input class="py-1 px-2 mb-2 border border-slate-400 rounded block"
        placeholder="Search icon" 
        #ref>
    <div class="grid grid-cols-6">
      <app-icon *ngFor="let icon of filteredIcons()" [iconName]="icon" [size]="32"></app-icon>
    </div>
  </div>
  `
})
export class IconPickerComponent implements AfterViewInit {

  public readonly ALL_ICONS = signal<IconName[]>(Object.keys(IconComponents) as IconName[]);

  @ViewChild("ref", { static: true }) ref!: ElementRef<HTMLInputElement>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  searchValue = signal<string>("");

  public filteredIcons = computed(() => {
    const searchValue = this.searchValue()?.trim()?.toLowerCase();
    if (!searchValue)
      return this.ALL_ICONS();
    return this.ALL_ICONS().filter(i => i.toLowerCase().includes(searchValue))
  });


  ngAfterViewInit(): void {
    const searchInput = this.ref.nativeElement;

    if (!searchInput)
      return;

    searchInput.focus();

    fromEvent(searchInput, 'input')
      .pipe(
        tap(() => this.searchValue.update(v => "xyzåäö")),
        takeUntil(this.destroyed$),
        map(() => searchInput.value),
        distinctUntilChanged(),
        debounce(i => timer(300))
      ).subscribe(newValue => this.searchValue.update(oldValue => newValue));
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
