import { Action } from '@ngrx/store';
import { ServiceMessageModel } from '../models/service-message.model';
import { Device } from '../enums/device.enum';
import { State } from '../reducers/app-status.reducer';

export enum AppStatusActionTypes {
  LoadAppStatus = '[App Component] trigger set AppStatus',
  SetAppStatus = '[AppStatus Effect] Set initial values for AppStatus',
  SetAppStatusFailed = '[AppStatus Effect] set initial values for AppStatus failed',
  Online = '[App Component] change online status to true',
  Offline = '[App Component] change online status to false',
  SetDevice = '[[AppStatus Effect]] set device type',
  SetStandalone = '[[AppStatus Effect]] set if running as PWA standalone'
}

export class LoadAppStatus implements Action {
  readonly type = AppStatusActionTypes.LoadAppStatus;
}

export class SetAppStatus implements Action {
  readonly type = AppStatusActionTypes.SetAppStatus;
  constructor(public payload: State) { }
}

export class SetAppStatusFailed implements Action {
  readonly type = AppStatusActionTypes.SetAppStatusFailed;
  constructor(public payload: ServiceMessageModel) { }
}

export class Online implements Action {
  readonly type = AppStatusActionTypes.Online;
}

export class Offline implements Action {
  readonly type = AppStatusActionTypes.Offline;
}

export class SetDevice implements Action {
  readonly type = AppStatusActionTypes.SetDevice;
  constructor(public payload: Device) { }
}

export class SetStandalone implements Action {
  readonly type = AppStatusActionTypes.SetStandalone;
  constructor(public payload: boolean) { }
}


export type AppStatusActions =
  LoadAppStatus
  | SetAppStatus
  | SetAppStatusFailed
  | Online
  | Offline
  | SetDevice
  | SetStandalone;
