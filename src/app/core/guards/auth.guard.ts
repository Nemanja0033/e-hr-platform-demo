import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '../store/user.store';

export const authGuard = (role: "hr" | "employee"): CanActivateFn => {

  return () => {
    const userStore = inject(UserStore);
    const router = inject(Router);

    const isAuth = userStore.getUserRole();
    console.log("userStore role", isAuth);

    if (isAuth) {
      console.log("guard passing");
      return true;
    }
    else {
      return router.createUrlTree([`/${role}/auth`]);
    }
  }
};
