import { Component, inject } from '@angular/core';
import { tap, finalize, Observable, take } from 'rxjs';
import { VacationReviewService } from '../services/vacation-review.service';
import { ToastService } from '../../../shared/services/ui/toast.service';

@Component({
  selector: 'app-vacation-review',
  templateUrl: './vacation-review.component.html',
})
export class VacationReviewComponent {
  private toastService = inject(ToastService);
  private vacationReviewService = inject(VacationReviewService);

  requests$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  selectedPage$: Observable<number>;
  pages$: Observable<number[]>;

  isActionsDisabled: boolean = false;

  constructor() {
    this.requests$ = this.vacationReviewService.vacationRequestReviews$;
    this.isLoading$ = this.vacationReviewService.isLoading$;
    this.selectedPage$ = this.vacationReviewService.selectedPage$;
    this.pages$ = this.vacationReviewService.allPages$;
  }

  onPageSelect(page: number) {
    this.vacationReviewService.selectPage(page);
  }

  onSearchTermToggle(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.vacationReviewService.toggleSearch(value);
  }

  onRequestAction(rawRequestData: any, status: 'approved' | 'rejected') {
    const mapedReviewData = { ...rawRequestData, status };

    this.isActionsDisabled = true;
    this.vacationReviewService
      .reviewVacationRequest(mapedReviewData)
      .pipe(
        finalize(() => {
          this.isActionsDisabled = false;
          this.toastService.open(`Request ${status} successfully`, status === 'approved' ? 'success' : 'info');
          this.vacationReviewService.refetch();
        })
      )
      .subscribe();
  }

  onApproveAll() {
    this.requests$.pipe(take(1)).subscribe(requests => {
      const mapedReqs = requests.map((req: any) => {
        return {
          status: 'approved',
          ...req
        };
      });
      this.vacationReviewService.approveAllVacationRequest(mapedReqs).subscribe({
        next: () => {
          this.toastService.open('All requests approved', 'success');
          this.vacationReviewService.refetch();
        }
      });
    });
  }
}
