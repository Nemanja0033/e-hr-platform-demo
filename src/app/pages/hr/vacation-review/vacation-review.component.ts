import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize, Subject, takeUntil, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VacationReviewService } from '../../../core/services/vacation-review.service';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';

import { NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vacation-review',
  imports: [DatePipe, NgClass, MatProgressSpinnerModule],
  templateUrl: './vacation-review.component.html',
})
export class VacationReviewComponent implements OnInit, OnDestroy {
  private MS_PER_DAY = 1000 * 60 * 60 * 24;
  private destroy$ = new Subject<void>();

  requests;
  isLoading;
  isActionsDisabled = signal<boolean>(false);

  constructor(
    private vacationReviewService: VacationReviewService,
    private _snackbar: MatSnackBar,
    private webSocketService: WebSocketService
  ) {
    this.requests = vacationReviewService.vacationRequestReviews;
    this.isLoading = vacationReviewService.isLoading;
  }

  ngOnInit(): void {
    this.webSocketService.on("vacationRequest:new").pipe(
      takeUntil(this.destroy$)
    ).subscribe(reqData => this.vacationReviewService.insertRealtimeVacationRequests(reqData));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  // TODO refactor this handler function to be reusable (e.g handleRequest(status: "apporved" | "rejected"))
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
