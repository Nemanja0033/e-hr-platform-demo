import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class VacationReviewHttpService {
    constructor(private http: HttpClient) {}

    getVacationRequests() {
        return this.http.get('http://localhost:3000/api/hr/vacation');
    }

    reviewVacationRequest(reviewData: {
        status: 'approved' | 'rejected';
        requestId: string;
        employeeId: string;
        requestedDays: number;
    }) {
        return this.http.patch('http://localhost:3000/api/hr/vacation', reviewData);
    }
}
