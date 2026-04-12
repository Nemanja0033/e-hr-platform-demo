import { Injectable } from "@angular/core";
import { BehaviorSubject, finalize, tap, Observable } from "rxjs";
import { CompanyHttpService } from "./company-http.service";

export interface CompanyInterface {
  id: string,
  name: string,
  size: number,
  employees: any[],
  Hr: any,
  hrId: String
}

@Injectable()
export class CompanyService {
  private _company$ = new BehaviorSubject<CompanyInterface | null>(null);
  private _loading$ = new BehaviorSubject<boolean>(false);

  company$ = this._company$.asObservable();
  loading$ = this._loading$.asObservable();

  constructor(private companyHttpService: CompanyHttpService) { }

  getCompanyData() {
    this._loading$.next(true);

    return this.companyHttpService.getCompany().pipe(
      tap((company: CompanyInterface | any) => this._company$.next(company)),
      finalize(() => this._loading$.next(false))
    )
  }

  registerCompany(company: { name: string }) {
    return this.companyHttpService.registerCompany(company);
  }

  refetch() {
    this.getCompanyData().subscribe();
  }

  get companyValue() {
    return this._company$.value;
  }
}
