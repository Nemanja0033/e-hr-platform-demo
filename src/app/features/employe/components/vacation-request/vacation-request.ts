import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserStore } from '../../../../core/store/user.store';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vacation-request',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './vacation-request.html',
  styleUrl: './vacation-request.css',
})
export class VacationRequest {
  isRequestMode = signal(false);
  isInvalidDateRange = signal<boolean | null>(null);
  vacationDateForm;
  employeeData;
  vacationDaysLeft = signal<number | null>(null)

  constructor(
    private fb: FormBuilder,
    private userStore: UserStore,
    private _snackbar: MatSnackBar
  ) {
    this.employeeData = userStore.user;
    this.vacationDateForm = this.fb.nonNullable.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
    });
  }

  ngOnInit() {
    this.vacationDateForm.valueChanges.subscribe((val) => {
      const isEndDateSelected = val.endDate! > new Date();

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
        }
        else{
          this.isInvalidDateRange.set(false);
        }
      }
    });
  }

  toggleRequestMode() {
    this.isRequestMode.set(true);
  }

  onRequestFormSubmit() {
    if (this.vacationDateForm.invalid) {
      this.vacationDateForm.markAllAsTouched();
      return;
    }

  }
}
