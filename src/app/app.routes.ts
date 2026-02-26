import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { EmployeAuth } from './features/employe/components/employe-auth/employe-auth';
import { EmployeDashboard } from './features/employe/components/employe-dashboard/employe-dashboard';
// import { Home } from './pages/home/home';
import { HrAuth } from './features/hr/components/hr-auth/hr-auth';
import { AdminDashboard } from './features/hr/components/hr-dashboard/hr-dashboard';
import { VacationRequest } from './features/employe/components/vacation-request/vacation-request';
import { SickLeaveRequest } from './features/employe/components/sick-leave-request/sick-leave-request';

// TODO Use lazy loading for performance optimization.
export const routes: Routes = [
  // {
  //   path: '',
  //   component: Home,
  // },
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
    loadComponent: () => import('./features/hr/components/company-manager/company-manager').then(m => m.Company),
    canActivate: [authGuard('hr'), roleGuard('hr')],
  },
  {
    path: 'hr/dashboard/employes',
    loadComponent: () => import('./features/hr/components/employes-manager/employes-manager').then(m => m.Employes),
    canActivate: [authGuard('hr'), roleGuard('hr')],
  },
  {
    path: 'hr/dashboard/requests',
    loadComponent: () => import('./features/hr/components/vacation-review/vacation-review').then(m => m.VacationReview),
    canActivate: [authGuard('hr'), roleGuard('hr')]
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
  {
    path: 'employe/dashboard/vacation-request',
    component: VacationRequest,
    canActivate: [authGuard('employe'), roleGuard('employe')]
  },
  {
    path: 'employe/dashboard/sick-leave-request',
    component: SickLeaveRequest,
    canActivate: [authGuard('employe'), roleGuard('employe')]
  }
];
