import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Modules
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NavbarComponent } from './components/navbar/navbar.component';
import { NotificationsComponent } from './components/notifications/notifications';
import { PaginationComponent } from './components/pagination/pagination';
import { InputComponent } from './components/ui/input/input.component';
import { SpinnerComponent } from './components/ui/spinner/spinner.component';
import { DatepickerComponent } from './components/ui/datepicker/datepicker.component';
import { ToastComponent } from './components/ui/snackbar/toast.component';

@NgModule({
  declarations: [
    NavbarComponent,
    NotificationsComponent,
    PaginationComponent,
    InputComponent,
    SpinnerComponent,
    DatepickerComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    NotificationsComponent,
    PaginationComponent,
    InputComponent,
    SpinnerComponent,
    DatepickerComponent,
    ToastComponent
  ]
})
export class SharedModule { }
