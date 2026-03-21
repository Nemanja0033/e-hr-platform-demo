import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, finalize } from 'rxjs';
import { VacationReviewService } from '../../../core/services/vacation-review.service';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-vacation-review',
  standalone: true,
  imports: [DatePipe, NgClass, MatProgressSpinnerModule, Pagination],
  templateUrl: './vacation-review.component.html',
})
export class VacationReviewComponent {
  _snackbar = inject(MatSnackBar);
  vacationReviewService = inject(VacationReviewService);

  requests = this.vacationReviewService.vacationRequestReviews;
  isLoading = this.vacationReviewService.isLoading;
  selectedPage = this.vacationReviewService.selectedPage;
  pages = this.vacationReviewService.allPages;

  isActionsDisabled = signal<boolean>(false);

  onPageSelect(page: number) {
    this.vacationReviewService.selectPage(page);
  }

  onSearchTermToggle(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.vacationReviewService.toggleSearch(value);
  }

  onRequestAction(rawRequestData: any, status: 'approved' | 'rejected') {
    const mapedReviewData = { ...rawRequestData, status };

    this.vacationReviewService
      .reviewVacationRequest(mapedReviewData)
      .pipe(
        tap(() => this.isActionsDisabled.set(true)),
        finalize(() => {
          this.isActionsDisabled.set(false);
          this._snackbar.open(`Request ${status} successfully`, 'close');
          this.vacationReviewService.refetch();
        })
      )
      .subscribe();
  }

  onApproveAll() {
    const mapedReqs = this.requests().map((req: any) => {
      return {
        status: 'approved',
        ...req
      };
    });
    this.vacationReviewService.approveAllVacationRequest(mapedReqs).subscribe()
  }
}
