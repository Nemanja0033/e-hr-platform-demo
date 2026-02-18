import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserStore } from '../store/user.store';

export const authGuard = (role: "hr" | "employe"): CanActivateFn => {

  return () => {
    const userStore = inject(UserStore);
    const router = inject(Router);
    return userStore.isUserAuth$.pipe(
      map(isAuth => {
        if (isAuth) {
          return true;
        }

        return router.createUrlTree([`/${role}/auth`]);
      })
    );
  }
};
