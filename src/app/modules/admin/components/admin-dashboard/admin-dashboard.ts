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
    this.user$ = this.userStore?.user$; 
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.authService.getMe().subscribe({
        next: (user: any) => {
          this.userStore.setUser({ ...user, token });
        }
      });
    }
  }
}

