import { Component } from '@angular/core';
import { AuthHttpService } from '../../../modules/gateway/services/auth-http.service';
import { UserStore } from '../../../core/store/user.store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.html',
})
export class DashboardHome {
  user$: Observable<any>;
  
  constructor(
    private userStore: UserStore,
    private authService: AuthHttpService
  ) {
    this.user$ = this.userStore.user$;
  }
}
