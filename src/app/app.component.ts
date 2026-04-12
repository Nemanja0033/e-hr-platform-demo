import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthHttpService } from './modules/gateway/services/auth-http.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { UserStore } from './core/store/user.store';
import { WebSocketService } from './core/services/ws/webSocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private authService: AuthHttpService, private userStore: UserStore, private webSocketService: WebSocketService){}
  protected readonly title = 'frontend';


  // TODO inspect if there is a error cause for navbar rendering (role- based), maybe this overrides user data in store.
  ngOnInit() {
    const token = this.authService.getToken();
    const role = this.authService.getRole();
    const email = this.authService.getEmail();
    console.log({ token, role, email})

    if (token && role) {
      this.authService.getMe(role).subscribe({
        next: (user: any) => {
          this.userStore.setUser({ ...user, token });
        }
      });

      // this.webSocketService.connect(email);
      
    }
  }
}
