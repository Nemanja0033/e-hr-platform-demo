    import { Injectable, signal } from "@angular/core";
    import { VacationRequestService } from "../services/http/vacation-request-http.service";

    interface VacationRequest {
        startDate: Date,
        endDate: Date,
        id: string,
        employeId: string,
        status: string
    }

    @Injectable({ providedIn: "root" })
    export class VacationRequestStore { 
        constructor(private vacationRequestService: VacationRequestService) {
            this.refetch();
        }

        // Consider useage of bulit in toSignal or similar to enable automatic unsub when component destroys
        // HTTP observables handle unsub when http res is sent.

        private _vacationRequests = signal<VacationRequest[] | null>(null);
        private _loading = signal<boolean>(false);

        vacationRequests = this._vacationRequests.asReadonly();
        loading = this._loading.asReadonly();

        refetch(){
            this.vacationRequestService.getSubmitedVacationRequests().subscribe({
                next: (res: any) => {
                    this._loading.set(true);
                    this._vacationRequests.set(res);
                },
                complete: () => {
                    this._loading.set(false)
                }
            })
        }
    }