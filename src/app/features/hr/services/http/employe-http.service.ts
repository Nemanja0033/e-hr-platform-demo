import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface EmployeInterface {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
}

@Injectable({ providedIn: "root" })
export class EmployeService {
    constructor(private http: HttpClient){}

    registerEmployee(employee: EmployeInterface){
        return this.http.post('http://localhost:3000/api/employe/auth/register', employee);
    }

    getEmployes(){
        return this.http.get('http://localhost:3000/api/hr/employes');
    }
}