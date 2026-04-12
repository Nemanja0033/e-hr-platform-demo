import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { VacationRequestHttpService } from "./vacation-request-http.service";

interface VacationRequest {
    startDate: Date,
    endDate: Date,
    id: string,
    employeeId: string,
    status: string
}

@Injectable()
export class VacationRequestService { 
    private _vacationRequests$ = new BehaviorSubject<VacationRequest[] | null>(null);
    private _loading$ = new BehaviorSubject<boolean>(false);

    vacationRequests$ = this._vacationRequests$.asObservable();
    loading$ = this._loading$.asObservable();

    constructor(private vacationRequestHttpService: VacationRequestHttpService) {
        this.refetch();
    }

    refetch(){
        this._loading$.next(true);
        this.vacationRequestHttpService.getSubmitedVacationRequests().subscribe({
            next: (res: any) => {
                this._vacationRequests$.next(res);
            },
            complete: () => {
                this._loading$.next(false);
            },
            error: () => {
                this._loading$.next(false);
            }
        });
    }

    submitVacationRequest(reqData: { startDate: Date; endDate: Date }) {
        return this.vacationRequestHttpService.submitVacationRequest(reqData);
    }

    get vacationRequests() {
      return this._vacationRequests$.value;
    }
}
