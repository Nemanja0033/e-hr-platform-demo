import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Observable } from "rxjs";
import { UserStore } from "../../../core/store/user.store";
import { AsyncPipe } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../../core/services/auth/auth";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [RouterLink, AsyncPipe],
})
export class Navbar {
  isAuth$: Observable<boolean>;

  constructor(private router: Router, private userStore: UserStore, private authService: AuthService, private _snackbar: MatSnackBar) {
    this.isAuth$ = this.userStore.isUserAuth$;
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.authService.getMeHr().subscribe({
        next: (user: any) => {
          this.userStore.setUser({ ...user, token });
        }
      });
    }
  }

  handleLogout() {
    this.authService.logout();
    this.userStore.clearUser();
    this._snackbar.open("User signed out", 'Close');
    this.router.navigate(['/hr/auth']);
  }

}
