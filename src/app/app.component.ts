import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthHttpService } from './core/services/http/auth-http.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { UserStore } from './core/store/user.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ReactiveFormsModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthHttpService, private userStore: UserStore){}
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
