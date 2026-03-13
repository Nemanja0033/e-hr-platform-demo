import { Component, effect, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserStore } from '../../../core/store/user.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { VacationRequestService } from '../../../core/services/vacation-request.service';
import { MatProgressSpinner, MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DatePipe } from '@angular/common';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';
import { endDateValidator, startDateValidator, vacationDaysValidator } from '../../../core/validators/custom-validators';

@Component({
  selector: 'app-vacation-request',
  imports: [DatePipe, MatProgressSpinnerModule ,MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatProgressSpinner],
  templateUrl: './vacation-request.component.html',
})
export class VacationRequestComponent {
  private subscription = new Subscription();
  isRequestMode = signal(false);
  isInvalidDateRange = signal<boolean | null>(null);
  vacationDaysLeft = signal<number | null>(null);

  vacationDateForm;
  employeeData;
  vacationRequests;
  vacationRequestsLoading;

  constructor(
    private fb: FormBuilder,
    private userStore: UserStore,
    private _snackbar: MatSnackBar,
    private vacationRequestService: VacationRequestService,
    private webSocketService: WebSocketService
  ) {
    this.employeeData = userStore.user;
    this.vacationRequests = vacationRequestService.vacationRequests;
    this.vacationRequestsLoading = vacationRequestService.loading;

    const initialSelectedDate = new Date();
    initialSelectedDate.setDate(initialSelectedDate.getDate() + 1);

    this.vacationDateForm = this.fb.nonNullable.group({
      startDate: [initialSelectedDate, [Validators.required, startDateValidator()]],
      endDate: [initialSelectedDate, [Validators.required, endDateValidator('startDate')]],
    });

    // Add valdiator for vacationDays when data from store is ready
    effect(() => {
      const vacationDays = this.employeeData()?.vacationDays;

      if(!vacationDays) return;

      // Adding cross-field custom validator.
      this.vacationDateForm.addValidators(vacationDaysValidator(vacationDays));
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.webSocketService.on("vacationRequest:updated").subscribe( _ => this.vacationRequestService.refetch())
    )
  }

  toggleRequestMode() {
    this.isRequestMode.set(true);
  }

  onRequestFormSubmit() {
    if (this.vacationDateForm.invalid) {
      this.vacationDateForm.markAllAsTouched();
      return;
    }

    this.vacationRequestService.submitVacationRequest(this.vacationDateForm.getRawValue()).subscribe({
      next: () => {
        this.vacationRequestService.refetch();
        this._snackbar.open("Vacation request submited");
      },
      error: () => {
        this._snackbar.open("Server error");
      },
      complete: () => {
        this.isRequestMode.set(false)
      }
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
