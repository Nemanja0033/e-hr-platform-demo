import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../../services/auth-http.service";
import { UserStore } from "../../../store/user.store";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [RouterLink],
})
export class Navbar {
  isAuth;
  userRole;

  constructor(private router: Router, private userStore: UserStore, private authService: AuthService, private _snackbar: MatSnackBar) {
    this.isAuth = this.userStore.isUserAuth;
    this.userRole = this.userStore.userRole;
  }

  ngOnInit(){
    console.log("is role correct", this.userRole() === 'employe')
    console.log("USER ROLE ", this.userRole())
  }

  handleLogout() {
    this.authService.logout();
    this.userStore.clearUser();
    this._snackbar.open("User signed out", 'Close');
    this.router.navigate(['/']);
  }

}
