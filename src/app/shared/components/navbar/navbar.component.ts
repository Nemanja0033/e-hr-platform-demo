import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthHttpService } from "../../../core/services/http/auth-http.service";
import { UserStore } from "../../../core/store/user.store";
import { WebSocketService } from "../../../core/services/ws/webSocket.service";
import { AsyncPipe, JsonPipe } from "@angular/common";
import { Subject, takeUntil } from "rxjs";
import { Notifications } from "../notifications/notifications";

const notificationSound = new Audio('assets/notification.mp3');

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [RouterLink, Notifications],
})
export class NavbarComponent {
  private userStore = inject(UserStore);

  isAuth = this.userStore.isUserAuth;

  constructor(private webSocketService: WebSocketService, private router: Router, private authService: AuthHttpService, private _snackbar: MatSnackBar) {}

  handleLogout() {
    this.authService.logout();
    this.userStore.clearUser();
    this._snackbar.open("User signed out", 'Close');
    this.router.navigate(['/']);
  }
}
