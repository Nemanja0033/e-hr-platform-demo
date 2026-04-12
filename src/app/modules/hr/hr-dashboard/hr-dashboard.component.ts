import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthHttpService } from '../../../modules/gateway/services/auth-http.service';
import { UserStore } from '../../../core/store/user.store';

@Component({
  selector: 'app-hr-dashboard',
  
  templateUrl: './hr-dashboard.component.html',
})
export class HrDashboardComponent {
  user;
  constructor(
    private userStore: UserStore,
    private authService: AuthHttpService
  ) {
    // This is an observable $ - in name is common practice to detect a observable.
    // We use AsyncPipe to automate subscribe to the observable - (FALSE, we moved to SIGNALS approach)
    this.user = this.userStore.getUserSnapshot(); 
  }
}

