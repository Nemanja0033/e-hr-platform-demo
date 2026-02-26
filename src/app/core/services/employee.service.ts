import { Injectable, signal } from '@angular/core';
import { EmployeeHttpService } from './http/employee-http.service';

interface EmployeeInterface {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  companyId: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private _employees = signal<EmployeeInterface[] | null>(null);
  private _loading = signal<boolean | null>(null);

  employees = this._employees.asReadonly();
  loading = this._loading.asReadonly();

  constructor(private employeeHttpService: EmployeeHttpService) {
    this.refetch();
  }

  refetch() {
    this._loading.set(true);
    this.employeeHttpService.getEmployees().subscribe({
      next: (employees: any) => {
        this._employees.set(employees);
      },
      complete: () => {
        this._loading.set(false)
      }
    })
  }

  registerEmployee(employee: any) {
    return this.employeeHttpService.registerEmployee(employee);
  }
}
