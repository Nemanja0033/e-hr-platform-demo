import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthHttpService } from "../../../core/services/http/auth-http.service";
import { UserStore } from "../../../core/store/user.store";
import { WebSocketService } from "../../../core/services/ws/webSocket.service";
import { AsyncPipe, JsonPipe } from "@angular/common";
import { Subject, takeUntil } from "rxjs";

const notificationSound = new Audio('assets/notification.mp3');

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [RouterLink],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuth;
  userRole;
  sickLeaveNotification = signal<any[]>([]);
  destroy$ = new Subject<void>();

  constructor(private webSocketService: WebSocketService, private router: Router, private userStore: UserStore, private authService: AuthHttpService, private _snackbar: MatSnackBar) {
    this.isAuth = this.userStore.isUserAuth;
    this.userRole = this.userStore.userRole;
  }

  ngOnInit() {
    console.log('user role', this.userRole())
    if (this.userRole() === 'hr') {
      this.webSocketService.on("sickLeave:new").pipe(
        takeUntil(this.destroy$)
      ).subscribe((notification) => {
        console.log("ws callback called")
        this.sickLeaveNotification.update((perv) => [...perv, notification]);
        notificationSound.play().catch(err => {
          console.error('Audio play blocked:', err);
        });
      });
    }
  }

  handleLogout() {
    this.authService.logout();
    this.userStore.clearUser();
    this._snackbar.open("User signed out", 'Close');
    this.router.navigate(['/']);
  }

  // Prevent memory leak, unsub from observable and disconect from ws.
  ngOnDestroy(): void {
    if (this.userRole() === 'hr') {
      this.destroy$.next();
      this.webSocketService.disconnect();
    }
  }
}
