import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHttpService } from '../modules/gateway/services/auth-http.service';
import { UserStore } from './store/user.store';

@NgModule({
  imports: [CommonModule],
  providers: [
    AuthHttpService,
    UserStore
  ]
})
export class CoreModule { }
