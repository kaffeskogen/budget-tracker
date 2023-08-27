import { Injectable, WritableSignal, signal } from '@angular/core';

interface AppState {
  lastSelectedFormattedDate: WritableSignal<string>;
}

const defaultFormattedDate = new Intl.DateTimeFormat('sv-SE').format(new Date());

@Injectable({
  providedIn: 'root'
})
export class AppStateService implements AppState {

  lastSelectedFormattedDate = signal<string>(defaultFormattedDate);


}
