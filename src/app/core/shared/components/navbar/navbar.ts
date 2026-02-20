import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../../services/auth/auth";
import { UserStore } from "../../../store/user.store";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [RouterLink, AsyncPipe],
})
export class Navbar {
  isAuth;
  userRole;

  constructor(private router: Router, private userStore: UserStore, private authService: AuthService, private _snackbar: MatSnackBar) {
    this.isAuth = this.userStore.isUserAuth;
    this.userRole = userStore.userRole;
  }

  handleLogout() {
    this.authService.logout();
    this.userStore.clearUser();
    this._snackbar.open("User signed out", 'Close');
    this.router.navigate(['/']);
  }

}
