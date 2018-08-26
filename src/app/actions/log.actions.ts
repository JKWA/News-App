import { Action } from '@ngrx/store';
import { Log } from '../models/log.model';
import { ServiceMessageModel } from '../models/service-message.model';


export enum LogActionTypes {
  LoadLogs = '[Log] Load Logs',
  AddLog = '[Any Effect] Add log',
  AddLogFailed = '[Log Effect] Add log failed',
  DeleteAllLogs = '[Log Componenet] Remove all logs',
  DeleteAllLogsFailed = '[Log Effect] Remove all logs failed',
}

export class LoadLogs implements Action {
  readonly type = LogActionTypes.LoadLogs;
}

export class AddLog implements Action {
  readonly type = LogActionTypes.AddLog;
  constructor(public payload: any) { }
}

export class AddLogFailed implements Action {
  readonly type = LogActionTypes.AddLogFailed;
  constructor(public payload: ServiceMessageModel) { }
}

export class DeleteAllLogs implements Action {
  readonly type = LogActionTypes.DeleteAllLogs;
}

export class DeleteAllLogsFailed implements Action {
  readonly type = LogActionTypes.DeleteAllLogsFailed;
}

export type LogActions =
    LoadLogs
    | AddLog
    | AddLogFailed
    | DeleteAllLogs
    | DeleteAllLogsFailed;
