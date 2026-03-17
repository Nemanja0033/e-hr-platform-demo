import { Component } from '@angular/core';
import { AuthHttpService } from '../../../core/services/http/auth-http.service';
import { UserStore } from '../../../core/store/user.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  imports: [RouterLink],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome {
  user;
  constructor(
    private userStore: UserStore,
    private authService: AuthHttpService
  ) {
    // This is an observable $ - in name is common practice to detect a observable.
    // We use AsyncPipe to automate subscribe to the observable - (FALSE, we moved to SIGNALS approach)
    this.user = this.userStore.user 
  }
}
