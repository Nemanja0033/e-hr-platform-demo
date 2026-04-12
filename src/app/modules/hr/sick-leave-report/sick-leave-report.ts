import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SickLeaveReportsService } from '../../../modules/hr/services/sick-leave-reports.service';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';
import { Subject, takeUntil, Observable } from 'rxjs';
import { UserStore } from '../../../core/store/user.store';

@Component({
  selector: 'app-sick-leave-report',
  templateUrl: './sick-leave-report.html',
})
export class SickLeaveReport implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private sickLeaveReportsService = inject(SickLeaveReportsService);
  private userStore = inject(UserStore);
  webSocketService = inject(WebSocketService);

  isLoading$: Observable<boolean>;
  submitedSickLeaveRequests$: Observable<any[] | null>;

  constructor() {
    this.isLoading$ = this.sickLeaveReportsService.isLoading$;
    this.submitedSickLeaveRequests$ = this.sickLeaveReportsService.sickLeaveReportsData$;
  }

  ngOnInit(): void {
    this.sickLeaveReportsService.getSickLeaveReports();
    
    this.webSocketService.on('sickLeave:new').pipe(
      takeUntil(this.destroy$)
    ).subscribe((notification: any) => this.sickLeaveReportsService.insertRealtimeSickLeaveReports(notification));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.webSocketService.disconnect();
  }
}
