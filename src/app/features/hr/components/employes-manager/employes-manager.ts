import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { EmployeeStore } from '../../store/employee.store';
import { EmployeService } from '../../services/http/employe-http.service';

export interface EmployeType {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  vacationDays: number;
  sickLeave: number;
}

@Component({
  selector: 'app-employes-manager',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatLabel, MatInputModule, MatProgressSpinner],
  templateUrl: './employes-manager.html',
  styleUrl: './employes-manager.css',
})
export class Employes {
  employes;
  loading;

  registerEmployeeForm;
  isRegisterEmployeeMode = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private _snackbar: MatSnackBar,
    private employesStore: EmployeeStore,
    private employeeService: EmployeService
  ) {
    this.employes = employesStore.employes as any;
    this.loading = employesStore.loading;

    this.registerEmployeeForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', Validators.required, Validators.email],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(9)]],
      role: ['', [Validators.required]],
    });
  }

  toggleRegisterMode() {
    this.isRegisterEmployeeMode.set(true);
  }

  onRegisterEmployeeSubmit() {
    if (this.registerEmployeeForm.invalid) {
      this.registerEmployeeForm.markAllAsTouched();
      return;
    }

    this.employeeService.registerEmployee(this.registerEmployeeForm.getRawValue()).subscribe({
      next: (res: any) => {
        this.isRegisterEmployeeMode.set(false);
        this.employesStore.refetch();
        this._snackbar.open('Employee registered succesfully');
      },
    });
  }
}
