import { Injectable } from "@angular/core";
import { BehaviorSubject, tap, switchMap, finalize } from "rxjs";
import { CompanyService } from "../services/company/company.service";

export interface CompanyInterface {
    id: string,
    name: String,
    size: number,
    employes: any[],
    Hr: any,
    hrId: String
}
@Injectable({ providedIn: 'root' })
export class CompanyStore {
  // Observables => async pipe in component = old change detection system.
  // Consider of optimal signals usage, or hybrid.
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private companySubject = new BehaviorSubject<CompanyInterface | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  loading$ = this.loadingSubject.asObservable();
  company$ = this.companySubject.asObservable();

  constructor(private companyService: CompanyService) {
    this.init();
  }

  private init() {
    this.refreshTrigger$.pipe(
      tap(() => this.loadingSubject.next(true)),
      switchMap(() =>
        this.companyService.getCompany().pipe(
          finalize(() => this.loadingSubject.next(false))
        )
      )
    ).subscribe(company => {
      this.companySubject.next(company as CompanyInterface);
    });
  }

  refetch() {
    this.refreshTrigger$.next();
  }

  setCompany(company: CompanyInterface) {
    this.companySubject.next(company);
  }
}
