import { Component, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SickLeaveRequestHttpService } from '../../../core/services/http/sick-leave-request-http.service';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-sick-leave-request',
  imports: [MatProgressSpinnerModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './sick-leave-request.component.html',
  styleUrl: './sick-leave-request.component.css',
})
export class SickLeaveRequestComponent implements OnInit {
  sickLeaveRequestForm!: FormGroup;
  isLoading = signal(false);
  sickLeaveRequestData = signal([]);
  isRequestMode = signal(false);

  constructor(private fb: FormBuilder, private sickLeaveRequestHttpService: SickLeaveRequestHttpService) { }

  ngOnInit(): void {
    this.sickLeaveRequestForm = this.fb.nonNullable.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      sickType: [''],
      reason: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(250)]]
    })
  }

  ngOnDestroy() {

  }

  toggleRequestMode() {
    this.isRequestMode.set(true);
  }

  onRequestFormSubmit() {
    if(this.sickLeaveRequestForm.invalid){
      this.sickLeaveRequestForm.markAllAsTouched();
      return;
    }

    this.sickLeaveRequestHttpService.submitSickLeaveRequest(this.sickLeaveRequestForm.getRawValue()).pipe(
      tap(() => this.isLoading.set(true)),
      finalize(() => this.isLoading.set(false))
    ).subscribe()
  }
}
