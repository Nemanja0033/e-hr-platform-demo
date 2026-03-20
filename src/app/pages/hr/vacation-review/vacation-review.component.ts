import { DatePipe, NgClass } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { tap, finalize } from "rxjs";
import { VacationReviewService } from "../../../core/services/vacation-review.service";
import { Pagination } from "../../../shared/components/pagination/pagination";

@Component({
  selector: 'app-vacation-review',
  standalone: true, // Podrazumevano u novom Angularu
  imports: [DatePipe, NgClass, MatProgressSpinnerModule, Pagination],
  templateUrl: './vacation-review.component.html',
})
export class VacationReviewComponent {
  _snackbar = inject(MatSnackBar); 
  vacationReviewService = inject(VacationReviewService);

  // 1. Direktno povezivanje sa readonly signalima iz servisa
  requests = this.vacationReviewService.vacationRequestReviews;
  isLoading = this.vacationReviewService.isLoading;
  selectedPage = this.vacationReviewService.selectedPage;
  pages = this.vacationReviewService.allPages;
  
  isActionsDisabled = signal<boolean>(false);

  // 2. Akcije su sada samo "okidači" u servisu
  onPageSelect(page: number) {
    this.vacationReviewService.selectPage(page);
  }

  onRequestAction(rawRequestData: any, status: "approved" | "rejected") {
    // Logika mapiranja...
    const mapedReviewData = { ...rawRequestData, status };

    this.vacationReviewService.reviewVacationRequest(mapedReviewData).pipe(
      tap(() => this.isActionsDisabled.set(true)),
      finalize(() => {
        this.isActionsDisabled.set(false);
        this._snackbar.open(`Request ${status} successfully`, 'close');
        // Samo kažemo servisu da osveži, on zna kako
        this.vacationReviewService.refetch();
      })
    ).subscribe();
  }
}