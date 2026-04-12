import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

/* Since these components might not have their own module yet, we'll import them for now,
   but then move them when we build Feature Modules. For the Gateway and Auth,
   they can be part of their respective modules or App/Core. */

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/gateway/gateway.module').then(m => m.GatewayModule)
  },
  {
    path: 'hr',
    loadChildren: () => import('./modules/hr/hr.module').then(m => m.HrModule)
  },
  {
    path: 'employee',
    loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
