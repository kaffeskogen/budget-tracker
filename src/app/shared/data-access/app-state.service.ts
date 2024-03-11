import { Injectable, WritableSignal, signal } from '@angular/core';
export type StorageStrategy = 'unselected'|'in-memory'|'google-drive';

interface AppState {
  lastSelectedFormattedDate: WritableSignal<string>;
  storageStrategy: WritableSignal<StorageStrategy>;
}

const defaultFormattedDate = new Intl.DateTimeFormat('sv-SE').format(new Date());

@Injectable({
  providedIn: 'root'
})
export class AppStateService implements AppState {

  lastSelectedFormattedDate = signal<string>(defaultFormattedDate);
  storageStrategy = signal<StorageStrategy>('unselected');


}
