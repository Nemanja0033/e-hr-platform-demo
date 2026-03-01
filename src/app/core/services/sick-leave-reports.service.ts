import { inject, Injectable, signal } from "@angular/core";
import { SickLeaveReportsHttpService } from "./http/sick-leave-reports-http.service";
import { SubmitedSickLeaveRequestType } from "../models";
import { finalize } from "rxjs";

@Injectable({ providedIn: "root" })
export class SickLeaveReportsService {
    private http = inject(SickLeaveReportsHttpService);

    private _sickLeaveReportsData = signal<SubmitedSickLeaveRequestType[] | null>(null);
    private _isLoading = signal(false);

    sickLeaveReportsData = this._sickLeaveReportsData.asReadonly();
    isLoading = this._isLoading.asReadonly();

    getSickLeaveReports() {
        this._isLoading.set(true);

        this.http.getSickLeaveReports()
            .pipe(finalize(() => this._isLoading.set(false)))
            .subscribe(res => {
                this._sickLeaveReportsData.set(res as any);
            });
    }

    insertRealtimeSickLeaveReports(sickLeaveReport: SubmitedSickLeaveRequestType) {
        this._sickLeaveReportsData.update((perv: any) => [...perv, sickLeaveReport]);
    }

    refetchSickLeaveReports() {
        this.getSickLeaveReports();
    }
}