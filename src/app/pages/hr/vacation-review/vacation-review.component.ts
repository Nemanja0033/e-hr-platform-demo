import { Component, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize, Subject, takeUntil, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VacationReviewService } from '../../../core/services/vacation-review.service';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';

import { NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { calculateDays } from '../../../core/helpers/helpers';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-vacation-review',
  imports: [DatePipe, NgClass, MatProgressSpinnerModule, Pagination],
  templateUrl: './vacation-review.component.html',
})
export class VacationReviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  requests;
  isLoading;
  selectedPage;
  pages;
  isActionsDisabled = signal<boolean>(false);

  constructor(
    private vacationReviewService: VacationReviewService,
    private _snackbar: MatSnackBar,
    private webSocketService: WebSocketService
  ) {
    this.requests = vacationReviewService.vacationRequestReviews;
    this.isLoading = vacationReviewService.isLoading;
    this.selectedPage = vacationReviewService.selectedPage;
    this.pages = vacationReviewService.allPages;
  }

  ngOnInit(): void {
    this.vacationReviewService.getVacationRequests().subscribe();
    this.vacationReviewService.subscribeToWebSocketEvent().subscribe()
  }

  onPervPageSelect(){
    this.vacationReviewService.pervPage();
  }

  onNextPageSelect(){
    this.vacationReviewService.nextPage();
  }

  onPageSelect(page: number){
    this.vacationReviewService.selectPage(page);
  }

  onRequestAction(rawRequestData: any, status: "approved" | "rejected"){
    const requestedDays = calculateDays(new Date(rawRequestData.endDate), new Date(rawRequestData.endDate));

    const mapedReviewData = {
      ...rawRequestData,
      requestedDays,
      status
    };

    this.vacationReviewService.reviewVacationRequest(mapedReviewData).pipe(
      tap(() => this.isActionsDisabled.set(true)),
      finalize(() => {
          this.isActionsDisabled.set(false);
          this._snackbar.open(`Request ${mapedReviewData.status} sucessfully`, 'close');
          this.vacationReviewService.refetch();
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.vacationReviewService.dispose();
    this.destroy$.next();
  }
}