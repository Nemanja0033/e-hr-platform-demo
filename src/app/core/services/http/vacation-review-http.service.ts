import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface QueryParams {
    limit: number,
    page: number,
    searchTerm: string
}

@Injectable({ providedIn: 'root' })
export class VacationReviewHttpService {
    constructor(private http: HttpClient) {}

    getVacationRequests(queryParams: QueryParams) {
        return this.http.get(`http://localhost:3000/api/hr/vacation?page=${queryParams.page}&limit=${queryParams.limit}&searchTerm=${queryParams.searchTerm}`);
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
