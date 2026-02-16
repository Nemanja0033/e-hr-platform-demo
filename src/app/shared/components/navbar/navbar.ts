import { Component } from "@angular/core";
import { AuthService } from "../../../modules/core/services/auth";
import { UserStore } from "../../../modules/core/store/user.store";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [RouterLink],
})
export class Navbar {
  user: any = null;

  constructor(private userStore: UserStore, private authService: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      // prima Observer objekat → ti definišeš šta da se desi kada Observable emituje (next).
      this.authService.getMe().subscribe({
        next: (user: any) => { 
          this.userStore.setUser({ ...user, token });
        }
      });
    }
  }
}
