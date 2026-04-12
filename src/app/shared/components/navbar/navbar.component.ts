import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthHttpService } from '../../../modules/gateway/services/auth-http.service';
import { UserStore } from "../../../core/store/user.store";
import { ToastService } from "../../../shared/services/ui/toast.service";
import { BehaviorSubject, map } from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private userStore = inject(UserStore);
  private authService = inject(AuthHttpService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isAuth$ = this.userStore.isUserAuth$;
  userAvatarPrefix$ = this.userStore.user$.pipe(
    map(user => user?.name ? user.name[0].toUpperCase() : '')
  );
  isAvatarModalOpen$ = new BehaviorSubject<boolean>(false);

  forceCloseAvatarModal(isOtherModalOpen: boolean){
    if(isOtherModalOpen){
      this.isAvatarModalOpen$.next(false);
    }
  }

  toggleAvatarModal(){
    this.isAvatarModalOpen$.next(!this.isAvatarModalOpen$.value);
  }

  handleLogout() {
    this.authService.logout();
    this.userStore.clearUser();
    this.toastService.open("User signed out", 'info');
    this.router.navigate(['/']);
  }
}
