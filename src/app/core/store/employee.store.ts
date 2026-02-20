import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { EmployeService } from '../services/employe/employe.service';

interface EmployeInterface {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  companyId: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeStore {
  // private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  // private employesSubject = new BehaviorSubject<EmployeInterface[] | null>(null);
  // private loadingSubject = new BehaviorSubject<boolean>(false);
  // loading$ = this.loadingSubject.asObservable();
  // employes$ = this.employesSubject.asObservable();

  private _employes = signal<EmployeInterface[] | null>(null);
  private _loading = signal<boolean | null>(null);

  employes = this._employes.asReadonly();
  loading = this._loading.asReadonly();

  constructor(private employeService: EmployeService) {
    this.refetch();
  }

  refetch() {
    this._loading.set(true);
    this.employeService.getEmployes().subscribe({
      next: (employes: any) => {
        this._employes.set(employes);
      },
      complete: () => {
        this._loading.set(false)
      }
    })
  }
}
