import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SickLeaveRequestService } from '../../employee/services/sick-leave-request.service';
import { UserStore } from '../../../core/store/user.store';
import { ToastService } from '../../../shared/services/ui/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sick-leave-request',
  templateUrl: './sick-leave-request.component.html',
})
export class SickLeaveRequestComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sickLeaveService = inject(SickLeaveRequestService);
  private userStore = inject(UserStore);
  private toastService = inject(ToastService);

  sickLeaveRequestForm = this.fb.nonNullable.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    reason: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]]
  });

  employeeData$: Observable<any> = this.userStore.user$;
  isRequestMode: boolean = false;
  
  requests$: Observable<any[]>;
  isLoading$: Observable<boolean>;

  constructor() {
    this.requests$ = this.sickLeaveService.requests$;
    this.isLoading$ = this.sickLeaveService.isLoading$;
  }

  ngOnInit() {
    this.sickLeaveService.getSubmitedSickLeaveRequestData();
  }

  toggleRequestMode() {
    this.isRequestMode = !this.isRequestMode;
  }

  onRequestFormSubmit() {
    if (this.sickLeaveRequestForm.invalid) {
      this.sickLeaveRequestForm.markAllAsTouched();
      return;
    }

    const { startDate, endDate, reason } = this.sickLeaveRequestForm.getRawValue();
    const requestData = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason
    };

    this.sickLeaveService.submitSickLeaveRequest(requestData)
      .subscribe({
        next: () => {
          this.sickLeaveService.refetchSubmitedSickLeaveReqeustData();
          this.isRequestMode = false;
          this.sickLeaveRequestForm.reset();
          this.toastService.open('Sick leave request submitted', 'success');
        },
        error: (err) => {
          this.toastService.open(err.error?.message ?? 'Failed to submit request', 'error');
        }
      });
  }
}
