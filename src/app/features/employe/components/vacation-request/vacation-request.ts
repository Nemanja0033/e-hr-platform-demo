import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserStore } from '../../../../core/store/user.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { VacationRequestStore } from '../../../../core/store/vacation-requests.store';
import { VacationRequestService } from '../../../../core/services/vacation-request/vacation-request.service';
import { MatProgressSpinner, MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vacation-request',
  imports: [DatePipe, MatProgressSpinnerModule ,MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatProgressSpinner],
  templateUrl: './vacation-request.html',
  styleUrl: './vacation-request.css',
})
export class VacationRequest {
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
    private vacationRequestStore: VacationRequestStore,
    private vacationRequestService: VacationRequestService
  ) {
    this.employeeData = userStore.user;
    this.vacationRequests = vacationRequestStore.vacationRequests;
    this.vacationRequestsLoading = vacationRequestStore.loading;

    this.vacationDateForm = this.fb.nonNullable.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.vacationDateForm.valueChanges.subscribe((val) => {
        const isEndDateSelected = val.endDate! > new Date();

        // Prevent invalid date range (end date to be before start)
        if (val.endDate! < val.startDate!) {
          this.vacationDateForm.controls.endDate.setValue(val.startDate as Date);
          this._snackbar.open("End date cannot be before start date.");
          this.isInvalidDateRange.set(true);
        }

        if (val.startDate && val.endDate && isEndDateSelected) {
          const diff = Math.ceil(
            (new Date(val.endDate).getTime() - new Date(val.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
          );
          const daysLeft = this.employeeData()?.vacationDays ?? 0;
          this.vacationDaysLeft.set(daysLeft - diff);

          if (diff > daysLeft) {
            this._snackbar.open('You dont have required amount of vacation days.');
            this.isInvalidDateRange.set(true);
            this.vacationDaysLeft.set(0)
          }
          else {
            this.isInvalidDateRange.set(false);
          }
        }
      })
    )

    this.subscription.add(
      this.vacationDateForm.controls.startDate.valueChanges.subscribe(val => {
        // Sync the end date with the start date.
        this.vacationDateForm.controls.endDate.setValue(val as Date);
      })
    )

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
        this.vacationRequestStore.refetch()
      },
      complete: () => {
        this._snackbar.open("Vacation request submited");
        this.isRequestMode.set(false)
      }
    });

  }
}
