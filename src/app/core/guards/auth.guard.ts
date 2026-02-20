import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '../store/user.store';

export const authGuard = (role: "hr" | "employe"): CanActivateFn => {

  return () => {
    const userStore = inject(UserStore);
    const router = inject(Router);

    const isAuth = userStore.isUserAuth();

    if (isAuth) {
      return true;
    }
    else {
      return router.createUrlTree([`/${role}/auth`]);
    }
  }
};
