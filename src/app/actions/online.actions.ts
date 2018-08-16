import { Action } from '@ngrx/store';

export enum OnlineActionTypes {
  LoadOnline = '[Online] Load Online',
  Online = '[App Component] Set online',
  Offline = '[App Component] Set offline'
}

export class LoadOnline implements Action {
  readonly type = OnlineActionTypes.LoadOnline;
}

export class Online implements Action {
  readonly type = OnlineActionTypes.Online;
}

export class Offline implements Action {
  readonly type = OnlineActionTypes.Offline;
}

export type OnlineActions =
    LoadOnline
    | Online
    | Offline;
