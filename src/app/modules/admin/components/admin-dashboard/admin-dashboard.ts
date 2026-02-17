import { Component } from '@angular/core';
import { UserStore } from '../../../core/store/user.store';
import { AuthService } from '../../../core/services/auth/auth';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AsyncPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  user$: Observable<any>;
  constructor(
    private userStore: UserStore,
    private authService: AuthService
  ) {
    // This is an observable $ - in name is common practice to detect a observable.
    this.user$ = this.userStore?.user$; 
  }

}

