import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface CompanyInterface {
    id: string,
    name: String,
    size: number,
    employes: any[],
    hrId: String
}

@Injectable({ providedIn: 'root' })
export class CompanyStore {
    private companySubject = new BehaviorSubject<CompanyInterface | null>(null);
    company$ = this.companySubject.asObservable();
}