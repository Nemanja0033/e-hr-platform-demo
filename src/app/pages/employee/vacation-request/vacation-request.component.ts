import { Component, OnInit, signal } from '@angular/core';
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
import { calculateDays } from '../../../core/helpers/helpers';

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

  // Better not to init form inside constructor, use ngOnInit for that, bcs of case the form depends
  // On @Input or some external data which is not available in the constructor.
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

    this.vacationDateForm = this.fb.nonNullable.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
    });
  }

  // TODO use custom validators, for validation logic from (custom-validators.ts)
  ngOnInit() {
    this.subscription.add(
      this.vacationDateForm.valueChanges.subscribe((val) => {
        const isEndDateSelected = val.endDate! > new Date();

        if (val.endDate! < val.startDate!) {
          this.vacationDateForm.controls.endDate.setValue(val.startDate as Date);
          this._snackbar.open("End date cannot be before start date.");
          this.isInvalidDateRange.set(true);
        }

        // if(val.startDate! < new Date()) {
        //   this.vacationDateForm.controls.startDate.setValue(new Date(), { emitEvent: false });
        //   this._snackbar.open("Start date cannot be before today's date.");
        //   this.isInvalidDateRange.set(true);
        // }

        if (val.startDate && val.endDate && isEndDateSelected) {
          const diff = calculateDays(new Date(val.endDate), new Date(val.startDate));
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
    );

    this.subscription.add(
      this.vacationDateForm.controls.startDate.valueChanges.subscribe(val => {
        // Sync the end date with the start date.
        this.vacationDateForm.controls.endDate.setValue(val as Date);
      })
    );

    this.subscription.add(
      this.webSocketService.on("vacationRequest:updated").subscribe( _ => this.vacationRequestService.refetch())
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
}
