export interface SickLeaveRequestDataType {
    startDate: string | Date,
    endDate: string | Date,
    reason: string,
}

export interface SubmitedSickLeaveRequestType {
    id: string;
    startDate: string | Date;
    endDate: string | Date;
    reason?: string;
    sickType?: string;
    status?: string;
    employeId: string;
    employe?: {
        name: string;
        surname: string;
    }
}

export interface NotificationsType {
    type: string;
    body: {
       author: any;
       subject: string;
       timestamp: Date 
    }
}