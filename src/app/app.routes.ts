import { Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { Employe } from './employe/employe';

export const routes: Routes = [
    {
        path: 'admin',
        component: Admin
    },
    {
        path: 'employe',
        component: Employe
    }
];
