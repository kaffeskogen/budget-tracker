import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE, importProvidersFrom } from '@angular/core';

import localeSwedish from '@angular/common/locales/sv';
import { provideHttpClient } from '@angular/common/http';
import { ToastService } from './app/shared/ui/toast/toast.service';
registerLocaleData(localeSwedish);

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, CommonModule, NgHeroiconsModule),
        { provide: LOCALE_ID, useValue: 'sv' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'SEK' },
        provideAnimations(),
        provideHttpClient(),
        ToastService
    ]
})
    .catch(err => console.error(err));
