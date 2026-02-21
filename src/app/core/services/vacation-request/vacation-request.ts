import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({ providedIn: "root" })
export class VacationRequestService {
    constructor(private httpp: HttpClient){}

    submitVacationRequest(reqData: { startDate: Date, endDate: Date }){

    }
}