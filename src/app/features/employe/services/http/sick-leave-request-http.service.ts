import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SickLeaveRequestDataType } from "../../types/employe.types";

@Injectable({ providedIn: "root" })
export class SickLeaveRequestHttpService {
    constructor(private http: HttpClient){ }

    submitSickLeaveRequest(sickLeaveRequestData: SickLeaveRequestDataType){
        return this.http.post('http://localhost:3000/api/employe/sick-leave', sickLeaveRequestData);
    }
}