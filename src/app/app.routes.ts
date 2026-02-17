import { Routes } from '@angular/router';
import { AdminDashboard } from './modules/admin/components/admin-dashboard/admin-dashboard';
import { Home } from './modules/home/home';
import { HrAuth } from './modules/admin/components/admin-auth/hr-auth';
import { EmployeAuth } from './modules/employe/components/employe-auth/employe-auth';
import { EmployeDashboard } from './modules/employe/components/employe-dashboard/employe-dashboard';
import { authGuard } from './modules/core/guards/auth.guard';
import { roleGuard } from './modules/core/guards/role.guard';
export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'hr/auth',
        component: HrAuth,
    },
    {
        path: 'hr/dashboard', // samo "dashboard"
        component: AdminDashboard,
        canActivate: [authGuard, roleGuard('hr')]
    },
    {
        path: 'employe/auth',
        component: EmployeAuth
    },
    {
        path: 'employe/dashboard',
        component: EmployeDashboard,
        canActivate: [authGuard, roleGuard('employe')]
}
];