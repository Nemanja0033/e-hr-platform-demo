import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, finalize, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VacationRequestService {
  constructor(private http: HttpClient) {
    // HR logic only - need refactor
    this.getEmployesVacationRequest();
  }

  // Dirty service - workaround
  // Need to refactor and to keep service layer http-only.
  private _vacationRequestReviews = signal<any[] | null>(null);
  private _isLoading = signal<boolean>(false);

  vacationRequestReviews = this._vacationRequestReviews.asReadonly();
  isLoading = this._isLoading.asReadonly();

  submitVacationRequest(reqData: { startDate: Date; endDate: Date }) {
    return this.http.post('http://localhost:3000/api/employe/vacation', reqData);
  }

  getSubmitedVacationRequests() {
    return this.http.get('http://localhost:3000/api/employe/vacation')
  }

  // HR related logic
  getEmployesVacationRequest() {
    this._isLoading.set(true);
    return this.http
      .get('http://localhost:3000/api/hr/vacation')
      .pipe(
        finalize(() => this._isLoading.set(false))
      )
      .subscribe((requests) => this._vacationRequestReviews.set(requests as any));
  }

  refetchEmployesVacationRequest(){
    return this.getEmployesVacationRequest();
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
