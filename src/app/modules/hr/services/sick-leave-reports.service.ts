import { Injectable } from "@angular/core";
import { SickLeaveReportsHttpService } from "./sick-leave-reports-http.service";
import { BehaviorSubject, finalize, Observable } from "rxjs";
import { SubmitedSickLeaveRequestType } from "src/app/core/models";

@Injectable()
export class SickLeaveReportsService {
    private _sickLeaveReportsData$ = new BehaviorSubject<SubmitedSickLeaveRequestType[] | null>(null);
    private _isLoading$ = new BehaviorSubject<boolean>(false);

    sickLeaveReportsData$ = this._sickLeaveReportsData$.asObservable();
    isLoading$ = this._isLoading$.asObservable();

    constructor(private http: SickLeaveReportsHttpService) { }

    getSickLeaveReports() {
        this._isLoading$.next(true);

        this.http.getSickLeaveReports()
            .pipe(finalize(() => this._isLoading$.next(false)))
            .subscribe(res => {
                this._sickLeaveReportsData$.next(res as any);
            });
    }

    insertRealtimeSickLeaveReports(sickLeaveReport: SubmitedSickLeaveRequestType) {
        const current = this._sickLeaveReportsData$.value || [];
        this._sickLeaveReportsData$.next([...current, sickLeaveReport]);
    }

    refetchSickLeaveReports() {
        this.getSickLeaveReports();
    }
}