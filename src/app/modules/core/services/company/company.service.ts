import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CompanyService {
    constructor(private http: HttpClient){}

    registerCompany(company: { name: string }){
        return this.http.post('http://localhost:3000/api/company', company);
    }

    getCompany(){
        return this.http.get("http://localhost:3000/api/company");
    }
}