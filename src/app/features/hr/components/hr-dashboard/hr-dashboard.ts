import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth';
import { UserStore } from '../../../../core/store/user.store';

@Component({
  selector: 'app-hr-dashboard',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './hr-dashboard.html',
  styleUrl: './hr-dashboard.css',
})
export class AdminDashboard {
  user$: Observable<any>;
  constructor(
    private userStore: UserStore,
    private authService: AuthService
  ) {
    // This is an observable $ - in name is common practice to detect a observable.
    
    // We use AsyncPipe to automate subscribe to the observable
    this.user$ = this.userStore?.user$; 
  }

}

