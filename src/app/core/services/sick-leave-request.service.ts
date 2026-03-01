import { Injectable, signal } from "@angular/core";
import { finalize } from "rxjs";
import { SickLeaveRequestHttpService } from "./http/sick-leave-request-http.service";
import { SickLeaveRequestDataType, SubmitedSickLeaveRequestType } from "../models";

@Injectable({ providedIn: "root" })
export class SickLeaveRequestService {

  private _requests = signal<SubmitedSickLeaveRequestType[]>([]);
  private _isLoading = signal(false);

  requests = this._requests.asReadonly();
  isLoading = this._isLoading.asReadonly();

  constructor(private http: SickLeaveRequestHttpService) {}

  getSubmitedSickLeaveRequestData() {
    this._isLoading.set(true);

    this.http.getSubmitedSickLeaveRequest()
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe(res => {
        this._requests.set(res as any);
      });
  }

  refetchSubmitedSickLeaveReqeustData() {
    this.getSubmitedSickLeaveRequestData();
  }

  submitSickLeaveRequest(sickLeaveRequestData: SickLeaveRequestDataType) {
    return this.http.submitSickLeaveRequest(sickLeaveRequestData);
  }
}