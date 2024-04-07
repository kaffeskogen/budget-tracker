import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStateService } from '../data-access/app-state.service';

export const storageStrategyGuard: CanActivateFn = (route, state) => {
  const appState = inject(AppStateService);
  if (appState.storageStrategy() !== 'unselected') {
    console.log('Storage strategy selected')
    return true;
  }
  console.log('Storage strategy not selected');
  return inject(Router).createUrlTree(['landing'], { queryParams: { redirect: state.url } });
};
