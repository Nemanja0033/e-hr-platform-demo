import { Injectable, signal } from "@angular/core";
import { VacationRequestHttpService } from "./http/vacation-request-http.service";

interface VacationRequest {
    startDate: Date,
    endDate: Date,
    id: string,
    employeeId: string,
    status: string
}

@Injectable({ providedIn: "root" })
export class VacationRequestService { 
    private _vacationRequests = signal<VacationRequest[] | null>(null);
    private _loading = signal<boolean>(false);

    vacationRequests = this._vacationRequests.asReadonly();
    loading = this._loading.asReadonly();

    constructor(private vacationRequestHttpService: VacationRequestHttpService) {
        this.refetch();
    }

    refetch(){
        this.vacationRequestHttpService.getSubmitedVacationRequests().subscribe({
            next: (res: any) => {
                this._loading.set(true);
                this._vacationRequests.set(res);
            },
            complete: () => {
                this._loading.set(false)
            }
        })
    }

    submitVacationRequest(reqData: { startDate: Date; endDate: Date }) {
        return this.vacationRequestHttpService.submitVacationRequest(reqData);
    }
}
