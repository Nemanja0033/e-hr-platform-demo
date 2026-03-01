import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthHttpService } from './core/services/http/auth-http.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { UserStore } from './core/store/user.store';
import { WebSocketService } from './core/services/ws/webSocket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ReactiveFormsModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthHttpService, private userStore: UserStore, private webSocketService: WebSocketService){}
  protected readonly title = signal('frontend');


  // TODO inspect if there is a error cause for navbar rendering (role- based), maybe this overrides user data in store.
  ngOnInit() {
    const token = this.authService.getToken();
    const role = this.authService.getRole();
    const email = this.authService.getEmail();

    if (token && role && email) {
      this.authService.getMe(role).subscribe({
        next: (user: any) => {
          this.userStore.setUser({ ...user, token });
        }
      });

      // this.webSocketService.connect(email);
      
    }
  }
}
