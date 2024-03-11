import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStateService } from '../data-access/app-state.service';

export const storageStrategyGuard: CanActivateFn = (route, state) => {
  const appState = inject(AppStateService);
  if (appState.storageStrategy() !== 'unselected') {
    return true;
  }
  return inject(Router).createUrlTree(['first-run']);
};
