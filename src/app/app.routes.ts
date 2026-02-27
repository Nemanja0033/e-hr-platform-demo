import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { EmployeeAuthComponent } from './pages/employee/employee-auth/employee-auth.component';
import { EmployeeDashboardComponent } from './pages/employee/employee-dashboard/employee-dashboard.component';
import { HrAuthComponent } from './pages/hr/hr-auth/hr-auth.component';
import { HrDashboardComponent } from './pages/hr/hr-dashboard/hr-dashboard.component';
import { VacationRequestComponent } from './pages/employee/vacation-request/vacation-request.component';
import { SickLeaveRequestComponent } from './pages/employee/sick-leave-request/sick-leave-request.component';
import { Gateway } from './pages/gateway/gateway';

export const routes: Routes = [
  {
    path: '',
    component: Gateway,
  },
  {
    path: 'hr/auth',
    component: HrAuthComponent,
  },
  {
    path: 'hr/dashboard',
    component: HrDashboardComponent,
    canActivate: [authGuard('hr'), roleGuard('hr')],
  },
  {
    path: 'hr/dashboard/company',
    loadComponent: () => import('./pages/hr/company-manager/company-manager.component').then(m => m.CompanyManagerComponent),
    canActivate: [authGuard('hr'), roleGuard('hr')],
  },
  {
    path: 'hr/dashboard/employees',
    loadComponent: () => import('./pages/hr/employees-manager/employees-manager.component').then(m => m.EmployeesManagerComponent),
    canActivate: [authGuard('hr'), roleGuard('hr')],
  },
  {
    path: 'hr/dashboard/requests',
    loadComponent: () => import('./pages/hr/vacation-review/vacation-review.component').then(m => m.VacationReviewComponent),
    canActivate: [authGuard('hr'), roleGuard('hr')]
  },
  {
    path: 'hr/dashboard/sick-leave-reports',
    loadComponent: () => import('./pages/hr/sick-leave-report/sick-leave-report').then(m => m.SickLeaveReport),
    canActivate: [authGuard('hr'), roleGuard('hr')]
  },
  {
    path: 'employee/auth',
    component: EmployeeAuthComponent,
  },
  {
    path: 'employee/dashboard',
    component: EmployeeDashboardComponent,
    canActivate: [authGuard('employe'), roleGuard('employe')],
  },
  {
    path: 'employee/dashboard/vacation-request',
    component: VacationRequestComponent,
    canActivate: [authGuard('employe'), roleGuard('employe')]
  },
  {
    path: 'employee/dashboard/sick-leave-request',
    component: SickLeaveRequestComponent,
    canActivate: [authGuard('employe'), roleGuard('employe')]
  }
];
