import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Gateway } from './pages/gateway/gateway';
import { HrAuthComponent } from './pages/hr/hr-auth/hr-auth.component';
import { EmployeeAuthComponent } from './pages/employee/employee-auth/employee-auth.component';

export const routes: Routes = [
  // -------------------------
  // PUBLIC / ROOT
  // -------------------------
  {
    path: '',
    component: Gateway,
  },

  // -------------------------
  // HR AUTH
  // -------------------------
  {
    path: 'hr/auth',
    component: HrAuthComponent,
  },

  // -------------------------
  // HR DASHBOARD + CHILDREN
  // -------------------------
  {
    path: 'hr/dashboard',
    loadComponent: () =>
      import('./pages/hr/hr-dashboard/hr-dashboard.component')
        .then(m => m.HrDashboardComponent),
    canActivate: [authGuard('hr'), roleGuard('hr')],
    children: [
      {
        path: 'home',
        loadComponent: () => 
          import('./pages/hr/dashboard-home/dashboard-home')
            .then(m => m.DashboardHome)
      },
      {
        path: 'company',
        loadComponent: () =>
          import('./pages/hr/company-manager/company-manager.component')
            .then(m => m.CompanyManagerComponent)
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./pages/hr/employees-manager/employees-manager.component')
            .then(m => m.EmployeesManagerComponent)
      },
      {
        path: 'requests',
        loadComponent: () =>
          import('./pages/hr/vacation-review/vacation-review.component')
            .then(m => m.VacationReviewComponent)
      },
      {
        path: 'sick-leave-reports',
        loadComponent: () =>
          import('./pages/hr/sick-leave-report/sick-leave-report')
            .then(m => m.SickLeaveReport)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  // -------------------------
  // EMPLOYEE AUTH
  // -------------------------
  {
    path: 'employee/auth',
    component: EmployeeAuthComponent,
  },

  // -------------------------
  // EMPLOYEE DASHBOARD + CHILDREN
  // -------------------------
  {
    path: 'employee/dashboard',
    loadComponent: () =>
      import('./pages/employee/employee-dashboard/employee-dashboard.component')
        .then(m => m.EmployeeDashboardComponent),
    canActivate: [authGuard('employee'), roleGuard('employe')],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/employee/dashboard-home/dashboard-home')
        .then(m => m.DashboardHome)
      },
      {
        path: 'vacation-request',
        loadComponent: () =>
          import('./pages/employee/vacation-request/vacation-request.component')
            .then(m => m.VacationRequestComponent)
      },
      {
        path: 'sick-leave-request',
        loadComponent: () =>
          import('./pages/employee/sick-leave-request/sick-leave-request.component')
            .then(m => m.SickLeaveRequestComponent)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];
