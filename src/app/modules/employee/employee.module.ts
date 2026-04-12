import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

import { EmployeeAuthComponent } from './employee-auth/employee-auth.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { DashboardHome } from './dashboard-home/dashboard-home';
import { VacationRequestComponent } from './vacation-request/vacation-request.component';
import { SickLeaveRequestComponent } from './sick-leave-request/sick-leave-request.component';
import { SickLeaveRequestService } from './services/sick-leave-request.service';
import { SickLeaveRequestHttpService } from './services/sick-leave-request-http.service';
import { VacationRequestService } from './services/vacation-request.service';
import { VacationRequestHttpService } from './services/vacation-request-http.service';

const routes: Routes = [
  {
    path: 'auth',
    component: EmployeeAuthComponent,
  },
  {
    path: 'dashboard',
    component: EmployeeDashboardComponent,
    canActivate: [authGuard('employee'), roleGuard('employe')],
    children: [
      {
        path: 'home',
        component: DashboardHome
      },
      {
        path: 'vacation-request',
        component: VacationRequestComponent
      },
      {
        path: 'sick-leave-request',
        component: SickLeaveRequestComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [
    EmployeeAuthComponent,
    EmployeeDashboardComponent,
    DashboardHome,
    VacationRequestComponent,
    SickLeaveRequestComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    SickLeaveRequestService,
    SickLeaveRequestHttpService,
    VacationRequestService,
    VacationRequestHttpService
  ]
})
export class EmployeeModule { }
