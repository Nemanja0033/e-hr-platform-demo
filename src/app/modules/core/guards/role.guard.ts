import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map } from "rxjs";
import { UserStore } from "../store/user.store";

export const roleGuard = (requiredRole: "hr" | "employe"): CanActivateFn => {

  return () => {
    const userStore = inject(UserStore);
    const router = inject(Router);

    return userStore.user$.pipe(
      map(user => {
        if (user?.role === requiredRole) {
          console.log("ROLE GUARD",user?.role === requiredRole)
          return true;
        }

        return router.createUrlTree([`/${requiredRole}/auth`]);
      })
    );
  };
};
