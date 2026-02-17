import { Routes } from '@angular/router';
import { AdminDashboard } from './modules/admin/components/admin-dashboard/admin-dashboard';
import { Home } from './modules/home/home';
import { HrAuth } from './modules/admin/components/admin-auth/hr-auth';
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
    }
];

