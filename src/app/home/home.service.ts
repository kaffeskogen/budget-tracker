import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from '../shared/data-access/api.service';
import { Group } from '../shared/interfaces/Group';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface HomeState {
  groups: Group[];
  status: 'loading' | 'success' | 'error';
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private api = inject(ApiService);
  private state = signal<HomeState>({
    groups: [],
    status: 'loading',
    error: null
  });

  groups = computed(() => this.state().groups);

  constructor() {
    this.api.getGroups()
      .pipe(takeUntilDestroyed())
      .subscribe(g => {
        this.state.update((state) => ({
          ...state,
          groups: g
        } satisfies HomeState))
      });
  }



}
