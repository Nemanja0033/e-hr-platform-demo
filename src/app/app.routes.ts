import { Routes } from '@angular/router';
import { Admin } from './modules/admin/components/admin-auth/admin';
import { AdminDashboard } from './modules/admin/components/admin-dashboard/admin-dashboard';
import { Home } from './modules/home/home';
export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'hr',
        component: Admin,
    },
    {
        path: 'hr/dashboard', // samo "dashboard"
        component: AdminDashboard,
    }
];

