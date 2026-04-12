import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserStore } from './core/store/user.store';
import { AuthInterceptor } from './core/interceptors/bearer.interceptor';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

export function initializeApp(userStore: UserStore) {
  return () => userStore.rehydrateUser();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [UserStore],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
