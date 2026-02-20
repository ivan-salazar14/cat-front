import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors
} from '@angular/common/http';

import { APP_ROUTES } from './app.routes';
import {
  authInterceptor,
  loadingInterceptor,
  errorInterceptor
} from './core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    // Error handling
    provideBrowserGlobalErrorListeners(),
    
    // Zone.js change detection with event coalescing for better performance
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router configuration with view transitions and component input binding
    provideRouter(
      APP_ROUTES,
      withViewTransitions(),
      withComponentInputBinding()
    ),
    
    // HTTP client with interceptors
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        loadingInterceptor,
        errorInterceptor
      ])
    )
  ]
};