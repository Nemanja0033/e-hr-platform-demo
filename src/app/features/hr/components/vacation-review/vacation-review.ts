import { Component, signal } from '@angular/core';
import { VacationRequestService } from '../../../../core/services/http/vacation-request-http.service';
import { DatePipe } from '@angular/common';
import { finalize, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vacation-review',
  imports: [DatePipe],
  templateUrl: './vacation-review.html',
  styleUrl: './vacation-review.css',
})
export class VacationReview {
  MS_PER_DAY = 1000 * 60 * 60 * 24;

  requests;
  isLoading;
  isActionsDisabled = signal<boolean>(false);

  constructor(
    private vacationReviewService: VacationRequestService,
    private _snackbar: MatSnackBar
  ) {
    this.requests = vacationReviewService.vacationRequestReviews;
    this.isLoading = vacationReviewService.isLoading;
  }

  approveRequest(rawReviewData: any) {
    const requestedDays = Math.ceil(
      (rawReviewData.endDate - rawReviewData.startDate) / this.MS_PER_DAY
    );

    const requestReviewData = {
      ...rawReviewData,
      requestedDays,
      status: 'approved',
    };

    this.vacationReviewService
      .reviewVacationRequest(requestReviewData)
      .pipe(
        tap(() => this.isActionsDisabled.set(true)),
        finalize(() => {
          this.isActionsDisabled.set(false);
          this._snackbar.open(`Request ${requestReviewData.status} sucessfully`, 'close');
          this.vacationReviewService.refetchEmployesVacationRequest();
        })
      )
      .subscribe();
  }

  rejectRequest(rawReviewData: any) {
    const requestedDays = Math.ceil(
      (new Date(rawReviewData.endDate).getTime() - new Date(rawReviewData.startDate).getTime()) / this.MS_PER_DAY
    );

    const requestReviewData = {
      ...rawReviewData,
      requestedDays,
      status: 'rejected',
    };

    this.vacationReviewService
      .reviewVacationRequest(requestReviewData)
      .pipe(
        tap(() => this.isActionsDisabled.set(true)),
        finalize(() => {
          this.isActionsDisabled.set(false);
          this._snackbar.open(`Request ${requestReviewData.status} sucessfully`, 'close');
          this.vacationReviewService.refetchEmployesVacationRequest();
        })
      )
      .subscribe();
  }
}
