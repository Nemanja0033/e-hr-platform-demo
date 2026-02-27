import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SickLeaveReportsService } from '../../../core/services/sick-leave-reports.service';

@Component({
  selector: 'app-sick-leave-report',
  imports: [DatePipe],
  templateUrl: './sick-leave-report.html',
  styleUrl: './sick-leave-report.css',
})
export class SickLeaveReport implements OnInit {
  sickLeaveReportsService = inject(SickLeaveReportsService);

  isLoading = this.sickLeaveReportsService.isLoading;
  submitedSickLeaveRequests = this.sickLeaveReportsService.sickLeaveReportsData;

  ngOnInit(): void {
    this.sickLeaveReportsService.getSickLeaveReports()
  }
}
