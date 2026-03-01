import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SickLeaveReportsService } from '../../../core/services/sick-leave-reports.service';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';
import { Subject, takeUntil } from 'rxjs';
import { UserStore } from '../../../core/store/user.store';

@Component({
  selector: 'app-sick-leave-report',
  imports: [DatePipe],
  templateUrl: './sick-leave-report.html',
  styleUrl: './sick-leave-report.css',
})
export class SickLeaveReport implements OnInit, OnDestroy {
  private sickLeaveReportsService = inject(SickLeaveReportsService);
  private userStore = inject(UserStore);
  webSocketService = inject(WebSocketService);
  destroy$ = new Subject<void>();

  isLoading = this.sickLeaveReportsService.isLoading;
  submitedSickLeaveRequests = this.sickLeaveReportsService.sickLeaveReportsData;

  ngOnInit(): void {
    this.webSocketService.connect(this.userStore.user()?.email as string);

    this.sickLeaveReportsService.getSickLeaveReports();
    // Implement realtime reports update in the template.
    this.webSocketService.on('sickLeave:new').pipe(
      takeUntil(this.destroy$)
    ).subscribe((notification: any) => this.sickLeaveReportsService.insertRealtimeSickLeaveReports(notification))
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.webSocketService.disconnect();
  }
}
