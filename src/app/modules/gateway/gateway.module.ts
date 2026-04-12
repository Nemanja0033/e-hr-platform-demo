import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { Gateway } from './gateway';
import { AuthHttpService } from './services/auth-http.service';

const routes: Routes = [
  {
    path: '',
    component: Gateway
  }
];

@NgModule({
  declarations: [
    Gateway
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    AuthHttpService
  ]
})
export class GatewayModule { }
