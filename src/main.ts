import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE, importProvidersFrom, InjectionToken } from '@angular/core';

import localeSwedish from '@angular/common/locales/sv';
import { provideHttpClient } from '@angular/common/http';
import { ToastService } from './app/shared/ui/toast/toast.service';
import * as versionInfo from './environments/app-version';
registerLocaleData(localeSwedish);

export const Version = new InjectionToken<{version: string, buildDate: string, commitHash: string}>('ShipInfo');

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, CommonModule, NgHeroiconsModule),
        { provide: LOCALE_ID, useValue: 'sv' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'SEK' },
        provideAnimations(),
        provideHttpClient(),
        ToastService,
        { provide: Version, useValue: versionInfo }
    ]
})
    .catch(err => console.error(err));
