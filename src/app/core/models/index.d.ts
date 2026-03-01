export interface SickLeaveRequestDataType {
    startDate: Date,
    endDate: Date,
    reason: string,
    // sickType: string
}

export interface SubmitedSickLeaveRequestType {
    id: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
    sickType?: string;
    employeId: string;
}

export interface NotificationsType {
    type: string;
    body: {
       author: any;
       subject: string;
       timestamp: Date 
    }
}