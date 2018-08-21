import { Action } from '@ngrx/store';
import { Log } from '../models/log.model';
import { ServiceMessageModel } from '../models/service-message.model';


export enum LogActionTypes {
  LoadLogs = '[Log] Load Logs',
  DeleteAllLogs = '[Log Componenet] Remove all logs',
  AddLog = '[Log Effect] Add log'
}

export class LoadLogs implements Action {
  readonly type = LogActionTypes.LoadLogs;
}

export class AddLog implements Action {
  readonly type = LogActionTypes.AddLog;
  constructor(public payload: any) { }
}

export class AddLogFailed implements Action {
  readonly type = LogActionTypes.AddLog;
  constructor(public payload: ServiceMessageModel) { }
}

export class DeleteAllLogs implements Action {
  readonly type = LogActionTypes.DeleteAllLogs;
}

export type LogActions =
    LoadLogs
    | DeleteAllLogs
    | AddLog
    | AddLogFailed;
