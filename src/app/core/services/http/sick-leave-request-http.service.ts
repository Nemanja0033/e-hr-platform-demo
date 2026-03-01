import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SickLeaveRequestDataType } from "../../models";

@Injectable({ providedIn: "root" })
export class SickLeaveRequestHttpService {
    constructor(private http: HttpClient){ }

    submitSickLeaveRequest(sickLeaveRequestData: SickLeaveRequestDataType){
        return this.http.post('http://localhost:3000/api/employe/sick-leave', sickLeaveRequestData);
    }

    getSubmitedSickLeaveRequest(){
        return this.http.get("http://localhost:3000/api/employe/sick-leave");
    }
}