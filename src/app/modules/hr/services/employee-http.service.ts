import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface EmployeeInterface {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
}

@Injectable({ providedIn: "root" })
export class EmployeeHttpService {
    constructor(private http: HttpClient){}

    registerEmployee(employee: EmployeeInterface){
        return this.http.post('http://localhost:3000/api/employe/auth/register', employee);
    }

    getEmployees(){
        return this.http.get('http://localhost:3000/api/hr/employes');
    }
}