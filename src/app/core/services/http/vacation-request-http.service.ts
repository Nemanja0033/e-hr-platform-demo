import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, finalize, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VacationRequestHttpService {
  constructor(private http: HttpClient) {  }

  submitVacationRequest(reqData: { startDate: Date; endDate: Date }) {
    return this.http.post('http://localhost:3000/api/employe/vacation', reqData);
  }

  getSubmitedVacationRequests() {
    return this.http.get('http://localhost:3000/api/employe/vacation')
  }
}