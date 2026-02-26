import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthHttpService } from "../../../core/services/http/auth-http.service";
import { UserStore } from "../../../core/store/user.store";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [RouterLink],
})
export class NavbarComponent {
  isAuth;
  userRole;

  constructor(private router: Router, private userStore: UserStore, private authService: AuthHttpService, private _snackbar: MatSnackBar) {
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
