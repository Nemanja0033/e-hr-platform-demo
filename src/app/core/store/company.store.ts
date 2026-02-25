import { Injectable, signal } from "@angular/core";
import { BehaviorSubject, tap, switchMap, finalize, shareReplay } from "rxjs";
import { CompanyService } from "../services/http/company-http.service";

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
  // **Old code, uses Behaviour Subject from rxjs (old way for the reactive state)**

  // Observables => async pipe in component = old change detection system.
  // Consider of optimal signals usage, or hybrid.
  // private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  // private companySubject = new BehaviorSubject<CompanyInterface | null>(null);
  // private loadingSubject = new BehaviorSubject<boolean>(false);
  // loading$ = this.loadingSubject.asObservable();
  // company$ = this.companySubject.asObservable();

  private _company = signal<CompanyInterface | null>(null);
  private _loading = signal<boolean>(false);

  company = this._company.asReadonly();
  loading = this._loading.asReadonly();

  constructor(private companyService: CompanyService) {
    this.refetch();
  }

  refetch() {
    this._loading.set(true);
    this.companyService.getCompany().pipe(
      finalize(() => this._loading.set(false))
    ).subscribe((company: CompanyInterface | any) => this._company.set(company))
  }


  // setCompany(company: CompanyInterface) {
  //   this.companySubject.next(company);
  // }
}
