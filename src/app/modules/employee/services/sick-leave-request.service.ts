import { Injectable } from "@angular/core";
import { BehaviorSubject, finalize, Observable } from "rxjs";
import { SickLeaveRequestHttpService } from "./sick-leave-request-http.service";
import { SickLeaveRequestDataType, SubmitedSickLeaveRequestType } from "src/app/core/models";

@Injectable()
export class SickLeaveRequestService {

  private _requests$ = new BehaviorSubject<SubmitedSickLeaveRequestType[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);

  requests$ = this._requests$.asObservable();
  isLoading$ = this._isLoading$.asObservable();

  constructor(private http: SickLeaveRequestHttpService) {}

  getSubmitedSickLeaveRequestData() {
    this._isLoading$.next(true);

    this.http.getSubmitedSickLeaveRequest()
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe((res: any) => {
        this._requests$.next(res as any);
      });
  }

  refetchSubmitedSickLeaveReqeustData() {
    this.getSubmitedSickLeaveRequestData();
  }

  submitSickLeaveRequest(sickLeaveRequestData: SickLeaveRequestDataType) {
    return this.http.submitSickLeaveRequest(sickLeaveRequestData);
  }

  get requests() {
    return this._requests$.value;
  }
}