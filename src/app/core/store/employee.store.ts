import { Injectable } from '@angular/core';
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
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private employesSubject = new BehaviorSubject<EmployeInterface[] | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  loading$ = this.loadingSubject.asObservable();
  employes$ = this.employesSubject.asObservable();

  constructor(private employeService: EmployeService) {
    this.init();
  }

  private init(){
    this.refreshTrigger$.pipe(
      tap(() => this.loadingSubject.next(true)),
      switchMap(() => 
        this.employeService.getEmployes().pipe(
          finalize(() => this.loadingSubject.next(false))
        )
      )
    ).subscribe(employes => {
      this.employesSubject.next(employes as EmployeInterface[])
    });
  };

  refetch() {
    this.refreshTrigger$.next();
  }
}
