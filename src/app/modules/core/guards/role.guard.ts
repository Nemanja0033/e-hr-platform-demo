import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserStore } from "../store/user.store";

export const roleGuard = (requiredRole: "hr" | "employe"): CanActivateFn => {

  return () => {
    const userStore = inject(UserStore);
    const router = inject(Router);

    const role = localStorage.getItem('role');
    if(role === requiredRole){
      return true
    }

    return router.createUrlTree([`/${requiredRole}/auth`]);
  };
};
