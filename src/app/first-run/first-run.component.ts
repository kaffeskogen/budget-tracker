import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-first-run',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="p-8 mb-32">
      <div class="flex flex-col lg:flex-row">
        <h1 class="text-7xl lg:text-9xl bg-gradient-to-br from-blue-500 via-violet-500 to-red-500 text-transparent bg-clip-text min-h-10 font-bold pb-6">

        </h1>
        <svg viewBox="0 0 140 72" class="w-full max-w-3xl">
          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="100%" gradientUnits="userSpaceOnUse" >
              <stop stop-color="#3b82f6" offset="0%"/>
              <stop stop-color="#8b5cf6" offset="50%"/>
              <stop stop-color="#ef4444" offset="100%"/>
            </linearGradient>
          </defs>
          <text fill="url(#gradient)">
            <tspan font-size="20" x="0" dy="22" font-weight="bold">Den där</tspan>
            <tspan font-size="20" x="0" dy="22" font-weight="bold">jävla</tspan>
            <tspan font-size="20" x="0" dy="22" font-weight="bold">budget-appen</tspan>
          </text>
        </svg>
        <div class="mt-8">
          <h2 class="text-xl">
            Vart ska skiten sparas?
          </h2>
          
          @for (item of savingStrategies; track $index) {
            <button class="flex items-center mt-4 text-left" type="button" role="button" [disabled]="item.disabled" (click)="item.onclick()">
              <div class="w-10 h-10 bg-gray-200 mr-4 overflow-hidden flex-shrink-0 flex-grow-0 flex">
                @if(item.icon.startsWith('/')) {
                  <img [src]="item.icon" class="w-10" alt="icon" [ngClass]="item.extraClass"/>
                } @else {
                  <span class="text-4xl w-10 ml-[-4px]">{{item.icon}}</span>
                }
              </div>
              <div>
                <div class="font-bold">{{item.name}}</div>
                <div class="text-gray-600 mb-2">{{item.description}}</div>
              </div>
            </button>
          }

        </div>
      </div>
    </div>
  `,
  styles: `
    button[disabled] {
      cursor: not-allowed;
      opacity: 0.3;
      filter: grayscale(1);
    }
    button:not([disabled]):active {
      transform: scale(0.98);
    }
  `
})
export class FirstRunComponent {

  authService = inject(AuthService);

  savingStrategies = [
    {
      name: 'Lokalt',
      description: 'Spara allt lokalt på enheten. Inga synkroniseringar, inget tjafs.',
      icon: '📦',
      disabled: true,
      onclick: () => undefined
    },
    {
      name: 'Dropbox',
      description: 'Ge Evenflow Inc tillgång till allt du äger och har.',
      icon: '/assets/images/dropbox.png',
      extraClass: 'rounded-fullitem.icon',
      disabled: true,
      onclick: () => undefined
    },
    {
      name: 'Google Drive',
      description: 'För att Alphabet redan vet var du spenderar dina pengar.',
      icon: '/assets/images/google-drive.png',
      onclick: () => this.authService.login()
    },
    {
      name: 'OneDrive',
      description: 'Microsoft törstar mer data. Ge dem vad de vill ha.',
      icon: '/assets/images/microsoft.png',
      disabled: true,
      onclick: () => undefined
    }
  ]
}
