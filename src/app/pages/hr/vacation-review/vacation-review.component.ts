import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VacationReviewService } from '../../../core/services/vacation-review.service';

@Component({
  selector: 'app-vacation-review',
  imports: [DatePipe],
  templateUrl: './vacation-review.component.html',
  styleUrl: './vacation-review.component.css',
})
export class VacationReviewComponent {
  MS_PER_DAY = 1000 * 60 * 60 * 24;

  requests;
  isLoading;
  isActionsDisabled = signal<boolean>(false);

  constructor(
    private vacationReviewService: VacationReviewService,
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
          this.vacationReviewService.refetch();
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
          this.vacationReviewService.refetch();
        })
      )
      .subscribe();
  }
}
