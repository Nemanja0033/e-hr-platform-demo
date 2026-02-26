import { Injectable, signal } from "@angular/core";
import { finalize } from "rxjs";
import { CompanyHttpService } from "./http/company-http.service";

export interface CompanyInterface {
    id: string,
    name: String,
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

  constructor(private companyHttpService: CompanyHttpService) {
    this.refetch();
  }

  refetch() {
    this._loading.set(true);
    this.companyHttpService.getCompany().pipe(
      finalize(() => this._loading.set(false))
    ).subscribe((company: CompanyInterface | any) => this._company.set(company))
  }

  registerCompany(company: { name: string }) {
    return this.companyHttpService.registerCompany(company);
  }
}
