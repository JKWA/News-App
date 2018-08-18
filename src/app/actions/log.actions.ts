import { Action } from '@ngrx/store';
import { Log } from '../models/log.model';

export enum LogActionTypes {
  LoadLogs = '[Log] Load Logs',
  AddLogFromCategoryEffect = '[Category Effect] Add Log',
  AddLogFromFilterEffect = '[Filter Effect] Add Log',
  DeleteAllLogs = '[Log Componenet] Remove all logs',
  AddLog = '[Log Effect] Add log'
}

export class LoadLogs implements Action {
  readonly type = LogActionTypes.LoadLogs;
}

export class AddLogFromCategoryEffect implements Action {
  readonly type = LogActionTypes.AddLogFromCategoryEffect;
  constructor(public payload: any) { }
}

export class AddLogFromFilterEffect implements Action {
  readonly type = LogActionTypes.AddLogFromFilterEffect;
  constructor(public payload: any) { }
}

export class AddLog implements Action {
  readonly type = LogActionTypes.AddLog;
  constructor(public payload: Log) { }
}

export class DeleteAllLogs implements Action {
  readonly type = LogActionTypes.DeleteAllLogs;
}

export type LogActions =
    LoadLogs
    | AddLogFromCategoryEffect
    | AddLogFromFilterEffect
    | DeleteAllLogs
    | AddLog;
