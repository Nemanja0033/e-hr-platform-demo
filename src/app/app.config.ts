import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorFn } from './core/interceptors/bearer.interceptor';
import { UserStore } from './core/store/user.store';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNativeDateAdapter(),
    provideHttpClient(
      withInterceptors([authInterceptorFn])
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: (userStore: UserStore) => () => userStore.rehydrateUser(),
      deps: [UserStore],
      multi: true
    }
  ]
};
