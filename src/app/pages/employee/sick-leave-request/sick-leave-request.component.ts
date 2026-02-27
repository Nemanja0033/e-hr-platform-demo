import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SickLeaveRequestService } from '../../../core/services/sick-leave-request.service';
import { UserStore } from '../../../core/store/user.store';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-sick-leave-request',
  templateUrl: './sick-leave-request.component.html',
  styleUrl: './sick-leave-request.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDatepickerModule,   
    MatNativeDateModule,   
    DatePipe,
  ],
})
export class SickLeaveRequestComponent {
  private fb = inject(FormBuilder);
  private sickLeaveService = inject(SickLeaveRequestService);
  private userStore = inject(UserStore);

  sickLeaveRequestForm = this.fb.nonNullable.group({
    startDate: [new Date(), Validators.required],
    endDate: [new Date(), Validators.required],
    reason: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]]
  });

  employeeData = this.userStore.user;
  isRequestMode = signal(false);
  requests = this.sickLeaveService.requests;
  isLoading = this.sickLeaveService.isLoading;

  ngOnInit() {
    this.sickLeaveService.getSubmitedSickLeaveRequestData();
  }

  toggleRequestMode() {
    this.isRequestMode.set(true);
  }

  onRequestFormSubmit() {
    if (this.sickLeaveRequestForm.invalid) {
      this.sickLeaveRequestForm.markAllAsTouched();
      return;
    }

    this.sickLeaveService.submitSickLeaveRequest(this.sickLeaveRequestForm.getRawValue())
      .subscribe(() => {
        this.sickLeaveService.refetchSubmitedSickLeaveReqeustData();
        this.isRequestMode.set(false);
        this.sickLeaveRequestForm.reset();
      });
  }
}
