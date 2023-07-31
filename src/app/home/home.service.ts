import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from '../shared/data-access/api.service';
import { Group } from '../shared/interfaces/Group';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, retry, startWith } from 'rxjs';

export interface HomeState {
  groups: Group[];
  status: 'loading' | 'success' | 'error';
  error: string | null;
}

@Injectable()
export class HomeService {

  private api = inject(ApiService);
  private state = signal<HomeState>({
    groups: [],
    status: 'loading',
    error: null
  });

  retry$ = new Subject<void>();
  error$ = new Subject<Error>();

  groups = computed(() => this.state().groups);
  status = computed(() => this.state().status);
  error = computed(() => this.state().error);

  constructor() {
    this.api.$groups
      .pipe(
        takeUntilDestroyed(),
        retry({
          delay: (err) => {
            this.error$.next(err);
            return this.retry$;
          }
        })
      )
      .subscribe(g => {
        this.state.update((state) => ({
          ...state,
          status: 'success',
          groups: g
        } satisfies HomeState))
      });

    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe((error) =>
        this.state.update((state) => ({
          ...state,
          status: "error",
          error: error.message,
        } satisfies HomeState))
      );
  }

}
