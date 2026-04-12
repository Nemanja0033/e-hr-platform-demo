import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { ToastService } from '../../../shared/services/ui/toast.service';
import { finalize, tap, Observable } from 'rxjs';

@Component({
  selector: 'app-employees-manager',
  templateUrl: './employees-manager.component.html',
})
export class EmployeesManagerComponent {
  employees$: Observable<any>;
  loading$: Observable<boolean>;

  registerEmployeeForm;
  isRegisterEmployeeMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private employeeService: EmployeeService
  ) {
    this.employees$ = employeeService.employees$;
    this.loading$ = employeeService.loading$;

    this.registerEmployeeForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(9)]],
      role: ['', [Validators.required]],
    });
  }

  toggleRegisterMode() {
    this.isRegisterEmployeeMode = true;
  }

  onRegisterEmployeeSubmit() {
    if (this.registerEmployeeForm.invalid) {
      this.registerEmployeeForm.markAllAsTouched();
      return;
    }

    this.employeeService.registerEmployee(this.registerEmployeeForm.getRawValue()).pipe(
      tap(() => this.isRegisterEmployeeMode = false),
      finalize(() => {
        this.employeeService.refetch();
        this.toastService.open('Employee registered successfully', 'success');
      })
    ).subscribe({
      error: (err) => {
        this.toastService.open(err.error?.message ?? 'Registration failed', 'error');
      }
    });
  }

  cancelRegistration() {
    this.isRegisterEmployeeMode = false;
  }
}
