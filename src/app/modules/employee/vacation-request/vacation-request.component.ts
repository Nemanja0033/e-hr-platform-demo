import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserStore } from '../../../core/store/user.store';
import { ToastService } from '../../../shared/services/ui/toast.service';
import { Subscription, Observable } from 'rxjs';
import { VacationRequestService } from '../../employee/services/vacation-request.service';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';
import { endDateValidator, startDateValidator, vacationDaysValidator } from '../../../core/validators/custom-validators';

@Component({
  selector: 'app-vacation-request',
  templateUrl: './vacation-request.component.html',
})
export class VacationRequestComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private fb = inject(FormBuilder);
  private userStore = inject(UserStore);
  private toastService = inject(ToastService);
  private vacationRequestService = inject(VacationRequestService);
  private webSocketService = inject(WebSocketService);
  
  isRequestMode: boolean = false;
  isInvalidDateRange: boolean | null = null;
  vacationDaysLeft: number | null = null;

  vacationDateForm: FormGroup;
  employeeData$: Observable<any>;
  vacationRequests$: Observable<any[] | null>;
  vacationRequestsLoading$: Observable<boolean>;

  constructor() {
    this.employeeData$ = this.userStore.user$;
    this.vacationRequests$ = this.vacationRequestService.vacationRequests$;
    this.vacationRequestsLoading$ = this.vacationRequestService.loading$;

    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() + 1);
    const dateStr = initialDate.toISOString().split('T')[0];

    this.vacationDateForm = this.fb.nonNullable.group({
      startDate: [dateStr, [Validators.required, startDateValidator()]],
      endDate: [dateStr, [Validators.required, endDateValidator('startDate')]],
    });

    this.subscription.add(
      this.userStore.user$.subscribe(user => {
        const vacationDays = user?.vacationDays;
        if (vacationDays) {
          this.vacationDateForm.addValidators(vacationDaysValidator(vacationDays));
        }
      })
    );
  }

  ngOnInit() {
    this.subscription.add(
      this.webSocketService.on("vacationRequest:updated").subscribe(_ => this.vacationRequestService.refetch())
    );
  }

  toggleRequestMode() {
    this.isRequestMode = !this.isRequestMode;
  }

  onRequestFormSubmit() {
    if (this.vacationDateForm.invalid) {
      this.vacationDateForm.markAllAsTouched();
      return;
    }

    this.vacationRequestService.submitVacationRequest(this.vacationDateForm.getRawValue()).subscribe({
      next: () => {
        this.vacationRequestService.refetch();
        this.toastService.open("Vacation request submitted", "success");
        this.isRequestMode = false;
      },
      error: (err) => {
        this.toastService.open(err.error?.message ?? "Server error", "error");
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
