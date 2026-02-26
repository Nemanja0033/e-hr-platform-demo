import { Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { VacationReviewHttpService } from './http/vacation-review-http.service';

@Injectable({ providedIn: 'root' })
export class VacationReviewService {
  private _vacationRequestReviews = signal<any[] | null>(null);
  private _isLoading = signal<boolean>(false);

  vacationRequestReviews = this._vacationRequestReviews.asReadonly();
  isLoading = this._isLoading.asReadonly();

  constructor(private vacationReviewHttpService: VacationReviewHttpService) {
    this.refetch();
  }

  refetch() {
    this._isLoading.set(true);
    return this.vacationReviewHttpService.getVacationRequests()
      .pipe(
        finalize(() => this._isLoading.set(false))
      )
      .subscribe((requests) => this._vacationRequestReviews.set(requests as any));
  }

  reviewVacationRequest(reviewData: any) {
    return this.vacationReviewHttpService.reviewVacationRequest(reviewData);
  }
}