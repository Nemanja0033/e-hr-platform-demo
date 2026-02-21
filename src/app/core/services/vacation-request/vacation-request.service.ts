import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({ providedIn: "root" })
export class VacationRequestService {
    constructor(private http: HttpClient){}

    submitVacationRequest(reqData: { startDate: Date, endDate: Date }){
        return this.http.post('http://localhost:3000/api/employe/vacation', reqData);
    }

    getSubmitedVacationRequests(){
        return this.http.get('http://localhost:3000/api/employe/vacation');
    }

    reviewVacationRequest(reviewData: { status: "approved" | "rejected", requestId: string, employeeId: string, requestedDays: number}){
        return this.http.patch('http://localhost:3000/api/hr/vacation', reviewData);
    }
}