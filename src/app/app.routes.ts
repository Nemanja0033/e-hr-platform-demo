import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { EmployeAuth } from './features/employe/components/employe-auth/employe-auth';
import { EmployeDashboard } from './features/employe/components/employe-dashboard/employe-dashboard';
import { Home } from './features/home/home';
import { Company } from './features/hr/components/company-manager/company-manager';
import { HrAuth } from './features/hr/components/hr-auth/hr-auth';
import { Employes } from './features/hr/components/employes-manager/employes-manager';
import { AdminDashboard } from './features/hr/components/hr-dashboard/hr-dashboard';
export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'hr/auth',
    component: HrAuth,
  },
  {
    path: 'hr/dashboard',
    component: AdminDashboard,
    canActivate: [authGuard('hr'), roleGuard('hr')],
  },
  {
    path: 'hr/dashboard/company',
    component: Company,
    canActivate: [authGuard('hr'), roleGuard('hr')],
  },
  {
    path: 'hr/dashboard/employes',
    component: Employes,
    canActivate: [authGuard('hr'), roleGuard('hr')],
  },
  {
    path: 'employe/auth',
    component: EmployeAuth,
  },
  {
    path: 'employe/dashboard',
    component: EmployeDashboard,
    canActivate: [authGuard('employe'), roleGuard('employe')],
  },
];
