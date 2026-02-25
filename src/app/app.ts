import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './core/services/http/auth-http.service';
import { Navbar } from './core/shared/components/navbar/navbar';
import { UserStore } from './core/store/user.store';

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

    if (token && role) {
      this.authService.getMe(role).subscribe({
        next: (user: any) => {
          this.userStore.setUser({ ...user, token });
        }
      });
    }
  }
}
