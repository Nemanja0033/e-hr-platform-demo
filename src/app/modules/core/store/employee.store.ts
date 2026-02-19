import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmployeeStore {
  constructor(private https: HttpClient) {}

  registerEmployee(employee: {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
    companyId: string;
  }) {
    
  }
}
