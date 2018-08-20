import {Service} from '../enums/service.enum';

export class ServiceMessageModel {
    status: number;
    statusText: string;
    service: Service;
}
