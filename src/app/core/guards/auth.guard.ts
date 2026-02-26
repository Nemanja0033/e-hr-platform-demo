import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '../store/user.store';

export const authGuard = (role: "hr" | "employe"): CanActivateFn => {

  return () => {
    const userStore = inject(UserStore);
    const router = inject(Router);

    console.log("userStore", userStore.isUserAuth());
    const isAuth = userStore.isUserAuth();

    if (isAuth) {
      console.log("guard passing");
      return true;
    }
    else {
      return router.createUrlTree([`/${role}/auth`]);
    }
  }
};
