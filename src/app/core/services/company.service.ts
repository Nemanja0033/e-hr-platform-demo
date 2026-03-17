import { Injectable, signal } from "@angular/core";
import { finalize, tap } from "rxjs";
import { CompanyHttpService } from "./http/company-http.service";

export interface CompanyInterface {
    id: string,
    name: string,
    size: number,
    employees: any[],
    Hr: any,
    hrId: String
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private _company = signal<CompanyInterface | null>(null);
  private _loading = signal<boolean>(false);

  company = this._company.asReadonly();
  loading = this._loading.asReadonly();

  constructor(private companyHttpService: CompanyHttpService) { }

  getCompanyData() {
    this._loading.set(true);

    return this.companyHttpService.getCompany().pipe(
      tap((company: CompanyInterface | any) => this._company.set(company)), 
      finalize(() => this._loading.set(false))
    )
  }

  registerCompany(company: { name: string }) {
    return this.companyHttpService.registerCompany(company);
  }

  refetch(){
    this.getCompanyData().subscribe();
  }
}
