import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Navbar } from './modules/shared/components/navbar/navbar';
import { AuthService } from './modules/core/services/auth/auth';
import { UserStore } from './modules/core/store/user.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ReactiveFormsModule,],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private authService: AuthService, private userStore: UserStore){}
  protected readonly title = signal('frontend');

  ngOnInit() {
    const token = this.authService.getToken();
    const role = this.authService.getRole();

    if (token) {
      this.authService.getMe(role).subscribe({
        next: (user: any) => {
          this.userStore.setUser({ ...user, token });
        }
      });
    }
  }
}
