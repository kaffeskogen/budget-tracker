import { Injectable, signal } from '@angular/core';

type ToastMessage = {
  id: number,
  message: string,
  position: number,
  action?: { click: () => void, label: string }
  timeout: number
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  messages = signal<ToastMessage[]>([]);

  show(message: string, action?: { click: () => void, label: string }) {
    console.log('showing toast');
    const id = Math.floor(Math.random() * 1000000);

    const currentPoisitions = this.messages().map(m => m.position);
    let position = 0;
    while(currentPoisitions.includes(position)) {
      position++;
    }

    const timeout = window.setTimeout(() => this.remove(id), 5000);
    const toastMessage: ToastMessage = { message, id, timeout, position, action };
    this.messages.update(messages => [...messages, toastMessage]);
  }

  remove(id: number) {
    this.messages.update(messages => messages.filter(m => m.id !== id));
  }

  resetTimeout(id: number) {
    const message = this.messages().find(m => m.id === id);
    if (!message) {
      return;
    }
    window.clearTimeout(message.timeout);
    message.timeout = window.setTimeout(() => this.remove(id), 5000);
  }
}
