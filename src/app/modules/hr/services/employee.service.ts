import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeHttpService } from './employee-http.service';

interface EmployeeInterface {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  companyId: string;
}

@Injectable()
export class EmployeeService {
  private _employees$ = new BehaviorSubject<EmployeeInterface[] | null>(null);
  private _loading$ = new BehaviorSubject<boolean>(false);

  employees$ = this._employees$.asObservable();
  loading$ = this._loading$.asObservable();

  constructor(private employeeHttpService: EmployeeHttpService) {
    this.refetch();
  }

  refetch() {
    this._loading$.next(true);
    this.employeeHttpService.getEmployees().subscribe({
      next: (employees: any) => {
        this._employees$.next(employees);
      },
      complete: () => {
        this._loading$.next(false);
      },
      error: () => {
        this._loading$.next(false);
      }
    })
  }

  registerEmployee(employee: any) {
    return this.employeeHttpService.registerEmployee(employee);
  }

  get employeesValue() {
    return this._employees$.value;
  }
}
