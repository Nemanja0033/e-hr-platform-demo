import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

import { HrAuthComponent } from './hr-auth/hr-auth.component';
import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';
import { DashboardHome } from './dashboard-home/dashboard-home';
import { CompanyManagerComponent } from './company-manager/company-manager.component';
import { EmployeesManagerComponent } from './employees-manager/employees-manager.component';
import { VacationReviewComponent } from './vacation-review/vacation-review.component';
import { SickLeaveReport } from './sick-leave-report/sick-leave-report';
import { CompanyService } from './services/company.service';
import { CompanyHttpService } from './services/company-http.service';
import { EmployeeService } from './services/employee.service';
import { EmployeeHttpService } from './services/employee-http.service';
import { SickLeaveReportsService } from './services/sick-leave-reports.service';
import { SickLeaveReportsHttpService } from './services/sick-leave-reports-http.service';
import { VacationReviewService } from './services/vacation-review.service';
import { VacationReviewHttpService } from './services/vacation-review-http.service';

const routes: Routes = [
  {
    path: 'auth',
    component: HrAuthComponent,
  },
  {
    path: 'dashboard',
    component: HrDashboardComponent,
    canActivate: [authGuard('hr'), roleGuard('hr')],
    children: [
      {
        path: 'home',
        component: DashboardHome
      },
      {
        path: 'company',
        component: CompanyManagerComponent
      },
      {
        path: 'employees',
        component: EmployeesManagerComponent
      },
      {
        path: 'requests',
        component: VacationReviewComponent
      },
      {
        path: 'sick-leave-reports',
        component: SickLeaveReport
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
    HrAuthComponent,
    HrDashboardComponent,
    DashboardHome,
    CompanyManagerComponent,
    EmployeesManagerComponent,
    VacationReviewComponent,
    SickLeaveReport
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    CompanyService,
    CompanyHttpService,
    EmployeeService,
    EmployeeHttpService,
    SickLeaveReportsService,
    SickLeaveReportsHttpService,
    VacationReviewService,
    VacationReviewHttpService
  ]
})
export class HrModule { }
