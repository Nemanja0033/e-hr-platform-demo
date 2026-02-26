import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, finalize, map, tap } from 'rxjs';
import { VacatoionReviewService } from '../services/http/vacation-review.service';

@Injectable({ providedIn: 'root' })
export class VacationReviewStore {
  constructor(private http: HttpClient, private vacationReviewService: VacatoionReviewService) {
    this.getEmployesVacationRequest();
  }

  private _vacationRequestReviews = signal<any[] | null>(null);
  private _isLoading = signal<boolean>(false);

  vacationRequestReviews = this._vacationRequestReviews.asReadonly();
  isLoading = this._isLoading.asReadonly();

  getEmployesVacationRequest() {
    this._isLoading.set(true);
    return this.vacationReviewService.getVacationRequests()
      .pipe(
        finalize(() => this._isLoading.set(false))
      )
      .subscribe((requests) => this._vacationRequestReviews.set(requests as any));
  }

  refetchEmployesVacationRequest(){
    return this.getEmployesVacationRequest();
  }

}
