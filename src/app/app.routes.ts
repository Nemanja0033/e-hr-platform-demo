import { Routes } from '@angular/router';
import { Admin } from './modules/admin/components/admin-auth/admin';
import { AdminDashboard } from './modules/admin/components/admin-dashboard/admin-dashboard';
export const routes: Routes = [
    {
        path: 'hr',
        component: Admin,
    },
    {
        path: 'hr/dashboard', // samo "dashboard"
        component: AdminDashboard,
    }
];

